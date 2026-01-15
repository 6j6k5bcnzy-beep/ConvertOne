import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-6942695227282452/3269197482";

export default function Ad() {
  return <BannerAd unitId={adUnitId} size={BannerAdSize.BANNER} />;
}
