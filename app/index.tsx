import { formatNumber } from "@/utils/formatNumber";
import { parseLocalizedNumber } from "@/utils/number";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { conversions } from "../constants/conversions";
import { translations } from "../constants/i18n";
import AnimatedBackground from "../utils/AnimatedBackground";

import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

import mobileAds from "react-native-google-mobile-ads";

mobileAds().setRequestConfiguration({
  testDeviceIdentifiers: ["EMULATOR", "ABCDEF123456"],
});

const adUnitId = TestIds.BANNER;

export function Ad() {
  return (
    <View style={{ alignItems: "center" }}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
      />
    </View>
  );
}

export default function Index() {
  const normalize = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD") // sépare les accents
      .replace(/[\u0300-\u036f]/g, ""); // supprime les accents
  const translateY = useRef(new Animated.Value(0)).current;
  const [language, setLanguage] = useState<"fr" | "en">("en");
  const anim = useRef(new Animated.Value(0)).current;
  const sheetY = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(0);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        scrollY.current === 0 && gesture.dy > 10,

      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 10) {
          sheetY.setValue(gesture.dy);
        }
      },

      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120) {
          // on ferme
          Keyboard.dismiss();
          Animated.timing(sheetY, {
            toValue: 500,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            sheetY.setValue(0);
            setShowModeModal(false);
            setSearchMode("");
          });
        } else {
          // on revient à la position initiale
          Animated.spring(sheetY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const getSearchableText = (mode: string, lang: "fr" | "en") => {
    const [from, to] = mode.split("_to_");
    const t = translations[lang];

    const fromLabel = t.units[from] ?? from;
    const toLabel = t.units[to] ?? to;

    return normalize(
      [
        fromLabel,
        toLabel,
        from,
        to,
        mode, // kg_to_g
      ].join(" ")
    );
  };

  const t = translations[language];
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 70], // largeur d’un bouton
  });

  const changeLanguage = (nextLang: "fr" | "en") => {
    if (nextLang === language) return;

    Haptics.selectionAsync();
    setLanguage(nextLang);
  };

  const toggleLanguage = () => {
    const nextLang = language === "fr" ? "en" : "fr";
    setLanguage(nextLang);

    Animated.timing(anim, {
      toValue: nextLang === "fr" ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const formatModeLabel = (key: string, lang: "fr" | "en") => {
    const [from, to] = key.split("_to_");
    const t = translations[lang];

    if (!from || !to) return key;

    return `${t.units[from] ?? from} → ${t.units[to] ?? to}`;
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -40,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const categories = Object.keys(conversions);
  const [category, setCategory] = useState(categories[0]);
  const [isCategoryLoaded, setIsCategoryLoaded] = useState(false);

  const modes = Object.keys(conversions[category]);
  const [mode, setMode] = useState(modes[0]);

  const [value, setValue] = useState("");

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showModeModal, setShowModeModal] = useState(false);

  const [searchMode, setSearchMode] = useState(""); // texte de recherche
  const filteredModes = modes.filter((mode) => {
    const searchable = getSearchableText(mode, language);
    const search = normalize(searchMode);

    return searchable.includes(search);
  });

  const result = useMemo(() => {
    const n = parseLocalizedNumber(value);
    if (n === null) return "";

    const r = conversions[category][mode](n);

    return formatNumber(r);
  }, [value, category, mode]);

  const invertMode = () => {
    Haptics.selectionAsync();
    if (!mode.includes("_to_")) return;

    const [from, to] = mode.split("_to_");
    const inverted = `${to}_to_${from}`;

    // sécurité : vérifier que la conversion existe
    if (conversions[category][inverted]) {
      setMode(inverted);

      // bonus UX : échanger valeur ↔ résultat
      if (result !== "") {
        setValue(result);
      }
    }
  };

  useEffect(() => {
    if (!isCategoryLoaded) return;

    const saveCategory = async () => {
      try {
        await AsyncStorage.setItem("favoriteCategory", category);
      } catch (e) {
        console.log("Erreur sauvegarde catégorie", e);
      }
    };

    saveCategory();
  }, [category, isCategoryLoaded]);

  const [copied, setCopied] = useState(false);

  const copyResult = async () => {
    if (!result) return;

    await Clipboard.setStringAsync(result);
    Haptics.selectionAsync();
    setCopied(true);

    setTimeout(() => setCopied(false), 800);
  };

  const [favorites, setFavorites] = useState<string[]>([]); // utilisé pour le TRI

  const toggleFavorite = (mode: string) => {
    const isFav = favorites.includes(mode);

    Haptics.selectionAsync();

    if (isFav) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setFavorites((prev) => prev.filter((m) => m !== mode));
      return;
    }

    // feedback visuel immédiat + animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFavorites((prev) => [...prev, mode]);
  };

  const isFavorite = (mode: string) => favorites.includes(mode);

  const [pendingFavoriteMove, setPendingFavoriteMove] = useState<string | null>(
    null
  );

  // ✅ 1. Charger les favoris aux lancement
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem("favorites");
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (e) {
        console.log("Erreur chargement favoris", e);
      }
    };

    loadFavorites();
  }, []);

  // ✅ 2. Sauvegarder à chaque changement
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
      } catch (e) {
        console.log("Erreur sauvegarde favoris", e);
      }
    };

    saveFavorites();
  }, [favorites]);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLang = await AsyncStorage.getItem("language");
        if (storedLang === "fr" || storedLang === "en") {
          setLanguage(storedLang);
        }
      } catch (e) {
        console.log("Erreur chargement langue", e);
      }
    };

    loadLanguage();
  }, []);

  useEffect(() => {
    const saveLanguage = async () => {
      try {
        await AsyncStorage.setItem("language", language);
      } catch (e) {
        console.log("Erreur sauvegarde langue", e);
      }
    };

    saveLanguage();
  }, [language]);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const stored = await AsyncStorage.getItem("favoriteCategory");

        if (stored && conversions[stored]) {
          setCategory(stored);

          const modes = Object.keys(conversions[stored]);
          if (modes.length > 0) {
            setMode(modes[0]);
          }
        }
      } catch (e) {
        console.log("Erreur chargement catégorie", e);
      } finally {
        setIsCategoryLoaded(true);
      }
    };

    loadCategory();
  }, []);

  const sortedModes = [
    ...favorites.filter((f) => filteredModes.includes(f)),
    ...filteredModes.filter((m) => !favorites.includes(m)),
  ];

  const [fromUnit, toUnit] = useMemo(() => {
    if (!mode.includes("_to_")) return ["", ""];

    const [from, to] = mode.split("_to_");
    return [from, to];
  }, [mode]);

  const fromUnitLabel = t.units[fromUnit] ?? fromUnit;
  const toUnitLabel = t.units[toUnit] ?? toUnit;

  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const caretOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isFocused) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(caretOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(caretOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      caretOpacity.setValue(0);
    }
  }, [isFocused]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* 🌌 FOND ABSOLU PLEIN ÉCRAN */}
        <AnimatedBackground />

        {/* 📱 CONTENU */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              {/* TITRE */}
              <Animated.View
                style={[
                  styles.titleContainer,
                  {
                    transform: [{ translateY }],
                  },
                ]}
              >
                <Text style={styles.subtitle}>Universel</Text>
                <Text style={styles.title}>{t.title}</Text>
              </Animated.View>

              <View style={styles.langSwitch}>
                <Pressable
                  style={[
                    styles.langBtn,
                    language === "fr" && styles.langBtnActive,
                  ]}
                  onPress={() => changeLanguage("fr")}
                >
                  <Text style={styles.flag}>🇫🇷</Text>
                  <Text
                    style={[
                      styles.langText,
                      language === "fr" && styles.langTextActive,
                    ]}
                  >
                    FR
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.langBtn,
                    language === "en" && styles.langBtnActive,
                  ]}
                  onPress={() => changeLanguage("en")}
                >
                  <Text style={styles.flag}>🇬🇧</Text>
                  <Text
                    style={[
                      styles.langText,
                      language === "en" && styles.langTextActive,
                    ]}
                  >
                    EN
                  </Text>
                </Pressable>
              </View>

              <View style={styles.card}>
                {/* HAUT : choix */}
                <View style={styles.topRow}>
                  <Pressable
                    style={styles.selectBox}
                    onPress={() => setShowCategoryModal(true)}
                  >
                    <Text style={styles.selectText}>
                      {t.categories[category as keyof typeof t.categories]}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.selectBox}
                    onPress={() => setShowModeModal(true)}
                  >
                    <Text style={styles.selectText}>
                      {formatModeLabel(mode, language)}
                    </Text>
                  </Pressable>
                </View>

                {/* VALEUR ENTRÉE */}
                <Pressable
                  style={styles.fakeInputContainer}
                  onPress={() => inputRef.current?.focus()}
                >
                  <View style={styles.fakeInputRow}>
                    {(value !== "" || !isFocused) && (
                      <Text
                        style={[
                          styles.fakeInputText,
                          value === "" && { color: "#64748B" },
                        ]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.6}
                      >
                        {value === "" ? t.enterValue : value}
                      </Text>
                    )}

                    {isFocused && (
                      <Animated.View
                        style={[styles.caret, { opacity: caretOpacity }]}
                      />
                    )}

                    {value !== "" && (
                      <Text style={styles.fakeInputUnit}> {fromUnitLabel}</Text>
                    )}
                  </View>

                  <TextInput
                    ref={inputRef}
                    value={value}
                    onChangeText={setValue}
                    keyboardType="numeric"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={styles.realInput}
                  />
                </Pressable>

                {/* FLÈCHES */}
                <View style={styles.arrowsRow}>
                  <Text style={styles.arrow}>↓</Text>

                  <Pressable
                    onPress={invertMode}
                    style={({ pressed }) => [
                      styles.swapButton,
                      pressed && { transform: [{ scale: 0.92 }], opacity: 0.8 },
                    ]}
                  >
                    <Text style={styles.swapIcon}>⇄</Text>
                  </Pressable>
                </View>

                {/* RÉSULTAT */}
                <View style={styles.resultBox}>
                  <View style={styles.resultRow}>
                    <Text
                      style={styles.resultText}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.4}
                    >
                      {result === "" ? "—" : result}
                    </Text>

                    {result !== "" && (
                      <Text style={styles.resultUnit}>{toUnitLabel}</Text>
                    )}
                  </View>
                </View>
              </View>

              {/* MODAL CATÉGORIE */}
              <Modal
                visible={showCategoryModal}
                transparent
                animationType="slide"
              >
                <Pressable
                  style={styles.modalOverlay}
                  onPress={() => setShowCategoryModal(false)}
                >
                  <View style={styles.modalContent}>
                    {categories.map((cat) => (
                      <Pressable
                        key={cat}
                        style={styles.modalItem}
                        onPress={() => {
                          setCategory(cat);
                          setMode(Object.keys(conversions[cat])[0]);
                          setShowCategoryModal(false);
                        }}
                      >
                        <Text style={styles.modalItemText}>
                          {t.categories[cat as keyof typeof t.categories]}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </Pressable>
              </Modal>

              {/* MODAL MODE */}
              <Modal visible={showModeModal} transparent animationType="slide">
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : undefined}
                  style={{ flex: 1 }}
                >
                  <Pressable
                    style={styles.modalOverlay}
                    onPress={() => {
                      Keyboard.dismiss();
                      setShowModeModal(false);
                    }}
                  >
                    <View style={styles.dragHandle} />
                    <Animated.View
                      style={[
                        styles.modalContent,
                        { transform: [{ translateY: sheetY }] },
                      ]}
                      {...panResponder.panHandlers}
                    >
                      {/* barre de recherche */}
                      <TextInput
                        style={styles.searchInput}
                        placeholder={t.search}
                        placeholderTextColor="#64748B"
                        value={searchMode}
                        onChangeText={setSearchMode}
                        autoFocus
                      />

                      {/* liste */}

                      <FlatList
                        data={sortedModes}
                        keyExtractor={(item) => item}
                        keyboardShouldPersistTaps="handled"
                        onScroll={(e) => {
                          scrollY.current = e.nativeEvent.contentOffset.y;
                        }}
                        scrollEventThrottle={16}
                        renderItem={({ item }) => (
                          <Pressable
                            style={styles.modalItem}
                            onPress={() => {
                              setMode(item);
                              setShowModeModal(false);
                              setSearchMode("");
                            }}
                          >
                            <View style={styles.modeRow}>
                              <Text style={styles.modalItemText}>
                                {formatModeLabel(item, language)}
                              </Text>

                              <Pressable
                                onPress={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(item);
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 25,
                                    color: isFavorite(item)
                                      ? "#FACC15"
                                      : "#CBD5E1",
                                    transform: [
                                      {
                                        scale:
                                          item === pendingFavoriteMove
                                            ? 1.2
                                            : 1,
                                      },
                                    ],
                                  }}
                                >
                                  {isFavorite(item) ? "★" : "☆"}
                                </Text>
                              </Pressable>
                            </View>
                          </Pressable>
                        )}
                        style={{ maxHeight: 300 }}
                      />
                    </Animated.View>
                  </Pressable>
                </KeyboardAvoidingView>
              </Modal>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </View>
      <SafeAreaView edges={["bottom"]}>
        <Ad />
      </SafeAreaView>
    </View>
  );
}

const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#ffffffff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },

  /* HAUT */
  topRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  selectBox: {
    flex: 1,
    backgroundColor: "#f9f1f1ff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#0040ffff",
  },
  selectText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  /* INPUT */
  input: {
    backgroundColor: "#f8e9e9ff",
    borderRadius: 12,
    padding: 16,
    fontSize: 22,
    color: "#1E293B",
    borderWidth: 2,
    borderColor: "#6378f1ff",
    textAlign: "center",
  },

  inputWithUnit: {
    paddingRight: 9, // espace réservé pour l’unité
  },

  inputContainer: {
    width: "100%",
    minHeight: 56,
    position: "relative",
    marginBottom: 7,
  },

  inputUnit: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -12 }],
    fontSize: 18,
    fontWeight: "600",
    color: "#475569",
  },

  fakeInputContainer: {
    backgroundColor: "#f8e9e9ff",
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: "#6378f1ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },

  fakeInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  fakeInputText: {
    fontSize: 22,
    color: "#1E293B",
    fontWeight: "500",
    maxWidth: "70%",
  },

  fakeInputUnit: {
    fontSize: 18,
    fontWeight: "600",
    color: "#475569",
  },

  realInput: {
    position: "absolute",
    inset: 0,
    opacity: 0,
    fontSize: 22,
  },

  caret: {
    width: 2,
    height: 26,
    backgroundColor: "#1E293B",
    marginHorizontal: 2,
  },

  /* FLÈCHE */
  arrow: {
    fontSize: 55,
    textAlign: "center",
    color: "#637ff1ff",
    marginVertical: 10,
  },

  /* RÉSULTAT */
  resultBox: {
    backgroundColor: "#637df1ff",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
  },
  resultText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    maxWidth: "85%",
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalItem: {
    paddingVertical: 16,
  },
  modalItemText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
  },
  searchInput: {
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#637bf1ff",
    letterSpacing: 2,
    textShadowColor: "rgba(99, 113, 241, 0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4b62bdff",
    letterSpacing: 2,
    marginTop: 2,
    textTransform: "uppercase",
  },
  langSwitch: {
    flexDirection: "row",
    alignSelf: "flex-end",
    backgroundColor: "#f1f1f1",
    borderRadius: 40,
    padding: 6,
    marginBottom: 15,
  },

  langBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 19,
    gap: 2,
  },

  langBtnActive: {
    backgroundColor: "#375893ff",
  },

  flag: {
    fontSize: 15,
  },

  langText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#555",
  },

  langTextActive: {
    color: "#fff",
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginBottom: 10,
  },

  swapButton: {
    alignSelf: "center",
    marginVertical: 12,
    width: 30,
    height: 30,
    borderRadius: 22,
    backgroundColor: "#637ff1ff",
    alignItems: "center",
    justifyContent: "center",

    // OMBRE (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,

    // ANDROID
    elevation: 6,

    // feedback visuel
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },

  swapIcon: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "700",
  },

  arrowsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 35, // espace entre ↓ et ⇄
    marginVertical: 0,
  },

  modeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  unitText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
  },

  resultRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },

  resultUnit: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E0E7FF",
    marginBottom: 6,
  },
});
