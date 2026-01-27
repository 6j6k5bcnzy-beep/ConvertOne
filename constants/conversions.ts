export type ConversionFn = (value: number) => number;

export type Conversions = {
  [category: string]: {
    [mode: string]: ConversionFn;
  };
};

export const conversions: Conversions = {
  SPEED: {
    // --- BASE : m/s ---
    ms_to_kmh: (v) => v * 3.6,
    ms_to_cm_s: (v) => v * 100,
    ms_to_km_s: (v) => v / 1000,

    ms_to_mph: (v) => v * 2.23694,
    ms_to_fts: (v) => v * 3.28084,
    ms_to_ins: (v) => v * 39.3701,
    ms_to_knots: (v) => v * 1.94384,
    ms_to_mach: (v) => v / 343,

    // --- RETOUR VERS m/s ---
    kmh_to_ms: (v) => v / 3.6,
    cm_s_to_ms: (v) => v / 100,
    km_s_to_ms: (v) => v * 1000,

    mph_to_ms: (v) => v / 2.23694,
    fts_to_ms: (v) => v / 3.28084,
    ins_to_ms: (v) => v / 39.3701,
    knots_to_ms: (v) => v / 1.94384,
    mach_to_ms: (v) => v * 343,

    // VERS km/h
    cm_s_to_kmh: (v) => (v / 100) * 3.6,
    km_s_to_kmh: (v) => v * 3600,

    mph_to_kmh: (v) => v * 1.60934,
    fts_to_kmh: (v) => v * 1.09728,
    ins_to_kmh: (v) => v * 0.09144,
    knots_to_kmh: (v) => v * 1.852,
    mach_to_kmh: (v) => v * 343 * 3.6,

    // DEPUIS km/h
    kmh_to_cm_s: (v) => (v / 3.6) * 100,
    kmh_to_km_s: (v) => v / 3600,

    kmh_to_mph: (v) => v / 1.60934,
    kmh_to_fts: (v) => v / 1.09728,
    kmh_to_ins: (v) => v / 0.09144,
    kmh_to_knots: (v) => v / 1.852,
    kmh_to_mach: (v) => v / 3.6 / 343,
  },
  LENGTH: {
    /* ===== BASE METRE ===== */
    m_to_mm: (v) => v * 1000,
    m_to_cm: (v) => v * 100,
    m_to_dm: (v) => v * 10,
    m_to_dam: (v) => v / 10,
    m_to_hm: (v) => v / 100,
    m_to_km: (v) => v / 1000,
    m_to_angstrom: (v) => v * 1e10,

    m_to_inches: (v) => v / 0.0254,
    m_to_feet: (v) => v / 0.3048,
    m_to_yards: (v) => v / 0.9144,
    m_to_miles: (v) => v / 1609.344,

    /* ===== MILLIMETRE ===== */
    mm_to_m: (v) => v / 1000,
    mm_to_cm: (v) => v / 10,
    mm_to_dm: (v) => v / 100,
    mm_to_dam: (v) => v / 10_000,
    mm_to_hm: (v) => v / 100_000,
    mm_to_km: (v) => v / 1_000_000,
    mm_to_angstrom: (v) => v * 1e7,

    mm_to_inches: (v) => v / 25.4,

    /* ===== CENTIMETRE ===== */
    cm_to_mm: (v) => v * 10,
    cm_to_m: (v) => v / 100,
    cm_to_dm: (v) => v / 10,
    cm_to_dam: (v) => v / 1000,
    cm_to_hm: (v) => v / 10_000,
    cm_to_km: (v) => v / 100_000,
    cm_to_angstrom: (v) => v * 1e8,

    cm_to_inches: (v) => v / 2.54,
    cm_to_feet: (v) => v / 30.48,

    /* ===== DECIMETRE ===== */
    dm_to_mm: (v) => v * 100,
    dm_to_cm: (v) => v * 10,
    dm_to_m: (v) => v / 10,
    dm_to_dam: (v) => v / 100,
    dm_to_hm: (v) => v / 1000,
    dm_to_km: (v) => v / 10_000,
    dm_to_angstrom: (v) => v * 1e9,

    /* ===== DECAMETRE ===== */
    dam_to_mm: (v) => v * 10_000,
    dam_to_cm: (v) => v * 1000,
    dam_to_dm: (v) => v * 100,
    dam_to_m: (v) => v * 10,
    dam_to_hm: (v) => v / 10,
    dam_to_km: (v) => v / 100,
    dam_to_angstrom: (v) => v * 1e11,

    /* ===== HECTOMETRE ===== */
    hm_to_mm: (v) => v * 100_000,
    hm_to_cm: (v) => v * 10_000,
    hm_to_dm: (v) => v * 1000,
    hm_to_m: (v) => v * 100,
    hm_to_dam: (v) => v * 10,
    hm_to_km: (v) => v / 10,
    hm_to_angstrom: (v) => v * 1e12,

    /* ===== KILOMETRE ===== */
    km_to_mm: (v) => v * 1_000_000,
    km_to_cm: (v) => v * 100_000,
    km_to_dm: (v) => v * 10_000,
    km_to_m: (v) => v * 1000,
    km_to_dam: (v) => v * 100,
    km_to_hm: (v) => v * 10,
    km_to_angstrom: (v) => v * 1e13,

    km_to_miles: (v) => v / 1.609344,

    /* ===== ANGSTRÖM ===== */
    angstrom_to_m: (v) => v * 1e-10,
    angstrom_to_mm: (v) => v * 1e-7,
    angstrom_to_cm: (v) => v * 1e-8,
    angstrom_to_dm: (v) => v * 1e-9,
    angstrom_to_km: (v) => v * 1e-13,

    /* ================= US → METRIQUE ================= */
    inches_to_mm: (v) => v * 25.4,
    inches_to_cm: (v) => v * 2.54,
    inches_to_m: (v) => v * 0.0254,

    feet_to_cm: (v) => v * 30.48,
    feet_to_m: (v) => v * 0.3048,

    yards_to_m: (v) => v * 0.9144,

    miles_to_m: (v) => v * 1609.344,
    miles_to_km: (v) => v * 1.609344,
  },

  TEMPERATURE: {
    c_to_f: (v) => (v * 9) / 5 + 32,
    f_to_c: (v) => ((v - 32) * 5) / 9,
    c_to_k: (v) => v + 273.15,
    k_to_c: (v) => v - 273.15,
    f_to_k: (v) => ((v - 32) * 5) / 9 + 273.15,
    k_to_f: (v) => ((v - 273.15) * 9) / 5 + 32,
    c_to_r: (v) => ((v + 273.15) * 9) / 5,
    r_to_c: (v) => ((v - 491.67) * 5) / 9,
    c_to_re: (v) => v * 0.8,
    re_to_c: (v) => v / 0.8,
    c_to_de: (v) => ((100 - v) * 3) / 2,
    de_to_c: (v) => 100 - (v * 2) / 3,
    c_to_n: (v) => v * 0.33,
    n_to_c: (v) => v / 0.33,
    c_to_ro: (v) => (v * 21) / 40 + 7.5,
    ro_to_c: (v) => ((v - 7.5) * 40) / 21,
  },

  PRESSURE: {
    pa_to_kpa: (v) => v / 1000,
    kpa_to_pa: (v) => v * 1000,

    pa_to_bar: (v) => v / 100000,
    bar_to_pa: (v) => v * 100000,

    pa_to_atm: (v) => v / 101325,
    atm_to_pa: (v) => v * 101325,

    pa_to_mmhg: (v) => v / 133.322,
    mmhg_to_pa: (v) => v * 133.322,

    pa_to_psi: (v) => v / 6894.76,
    psi_to_pa: (v) => v * 6894.76,

    kpa_to_bar: (v) => v / 100,
    bar_to_kpa: (v) => v * 100,

    kpa_to_atm: (v) => v / 101.325,
    atm_to_kpa: (v) => v * 101.325,

    kpa_to_mmhg: (v) => v * 7.50062,
    mmhg_to_kpa: (v) => v / 7.50062,

    kpa_to_psi: (v) => v / 6.89476,
    psi_to_kpa: (v) => v * 6.89476,

    bar_to_atm: (v) => v / 1.01325,
    atm_to_bar: (v) => v * 1.01325,

    bar_to_mmhg: (v) => v * 750.062,
    mmhg_to_bar: (v) => v / 750.062,

    bar_to_psi: (v) => v * 14.5038,
    psi_to_bar: (v) => v / 14.5038,

    atm_to_mmhg: (v) => v * 760,
    mmhg_to_atm: (v) => v / 760,

    atm_to_psi: (v) => v * 14.6959,
    psi_to_atm: (v) => v / 14.6959,

    mmhg_to_psi: (v) => v * 0.0193368,
    psi_to_mmhg: (v) => v / 0.0193368,
  },

  MASS: {
    /* ===== BASE : KILOGRAMME ===== */
    kg_to_g: (v) => v * 1000,
    kg_to_hg: (v) => v * 10,
    kg_to_dg: (v) => v * 10_000,
    kg_to_cg: (v) => v * 100_000,
    kg_to_mg: (v) => v * 1_000_000,
    kg_to_ton: (v) => v / 1000,
    kg_to_q: (v) => v / 100,
    kg_to_lb: (v) => v * 2.20462,
    kg_to_oz: (v) => v * 35.274,

    /* ===== GRAMME ===== */
    g_to_kg: (v) => v / 1000,
    g_to_hg: (v) => v / 100,
    g_to_dg: (v) => v * 10,
    g_to_cg: (v) => v * 100,
    g_to_mg: (v) => v * 1000,
    g_to_ton: (v) => v / 1_000_000,
    g_to_q: (v) => v / 100_000,
    g_to_lb: (v) => v / 453.592,
    g_to_oz: (v) => v / 28.3495,

    /* ===== HECTOGRAMME ===== */
    hg_to_kg: (v) => v / 10,
    hg_to_g: (v) => v * 100,
    hg_to_dg: (v) => v * 1000,
    hg_to_cg: (v) => v * 10_000,
    hg_to_mg: (v) => v * 100_000,
    hg_to_ton: (v) => v / 10_000,
    hg_to_q: (v) => v / 1000,

    /* ===== DECIGRAMME ===== */
    dg_to_kg: (v) => v / 10_000,
    dg_to_g: (v) => v / 10,
    dg_to_hg: (v) => v / 1000,
    dg_to_cg: (v) => v * 10,
    dg_to_mg: (v) => v * 100,
    dg_to_ton: (v) => v / 10_000_000,
    dg_to_q: (v) => v / 1_000_000,

    /* ===== CENTIGRAMME ===== */
    cg_to_kg: (v) => v / 100_000,
    cg_to_g: (v) => v / 100,
    cg_to_hg: (v) => v / 10_000,
    cg_to_dg: (v) => v / 10,
    cg_to_mg: (v) => v * 10,
    cg_to_ton: (v) => v / 100_000_000,
    cg_to_q: (v) => v / 10_000_000,

    /* ===== MILLIGRAMME ===== */
    mg_to_kg: (v) => v / 1_000_000,
    mg_to_g: (v) => v / 1000,
    mg_to_hg: (v) => v / 100_000,
    mg_to_dg: (v) => v / 100,
    mg_to_cg: (v) => v / 10,
    mg_to_ton: (v) => v / 1_000_000_000,
    mg_to_q: (v) => v / 100_000_000,

    /* ===== TONNE ===== */
    ton_to_kg: (v) => v * 1000,
    ton_to_g: (v) => v * 1_000_000,
    ton_to_hg: (v) => v * 10_000,
    ton_to_dg: (v) => v * 10_000_000,
    ton_to_cg: (v) => v * 100_000_000,
    ton_to_mg: (v) => v * 1_000_000_000,
    ton_to_q: (v) => v * 10,
    ton_to_lb: (v) => v * 2204.62,
    ton_to_oz: (v) => v * 35_274,

    /* ===== QUINTAL ===== */
    q_to_kg: (v) => v * 100,
    q_to_g: (v) => v * 100_000,
    q_to_hg: (v) => v * 1000,
    q_to_dg: (v) => v * 1_000_000,
    q_to_cg: (v) => v * 10_000_000,
    q_to_mg: (v) => v * 100_000_000,
    q_to_ton: (v) => v / 10,
    q_to_lb: (v) => v * 220.462,
    q_to_oz: (v) => v * 3527.4,

    /* ===== US → METRIQUE ===== */
    lb_to_kg: (v) => v / 2.20462,
    lb_to_g: (v) => v * 453.592,
    lb_to_mg: (v) => v * 453_592,
    lb_to_ton: (v) => v / 2204.62,
    lb_to_q: (v) => v / 220.462,

    oz_to_kg: (v) => v / 35.274,
    oz_to_g: (v) => v * 28.3495,
    oz_to_mg: (v) => v * 28_349.5,
    oz_to_ton: (v) => v / 35_274,
    oz_to_q: (v) => v / 3527.4,
  },

  VOLUME: {
    /* ===== BASE LITRE ===== */
    l_to_ml: (v) => v * 1000,
    l_to_cl: (v) => v * 100,
    l_to_dl: (v) => v * 10,
    l_to_dal: (v) => v / 10,
    l_to_hl: (v) => v / 100,
    l_to_m3: (v) => v / 1000,

    /* ===== MILLILITRE ===== */
    ml_to_l: (v) => v / 1000,
    ml_to_cl: (v) => v / 10,
    ml_to_dl: (v) => v / 100,
    ml_to_dal: (v) => v / 10000,
    ml_to_hl: (v) => v / 100000,
    ml_to_m3: (v) => v / 1_000_000,

    /* ===== CENTILITRE ===== */
    cl_to_ml: (v) => v * 10,
    cl_to_l: (v) => v / 100,
    cl_to_dl: (v) => v / 10,
    cl_to_dal: (v) => v / 1000,
    cl_to_hl: (v) => v / 10000,
    cl_to_m3: (v) => v / 100_000,

    /* ===== DECILITRE ===== */
    dl_to_ml: (v) => v * 100,
    dl_to_cl: (v) => v * 10,
    dl_to_l: (v) => v / 10,
    dl_to_dal: (v) => v / 100,
    dl_to_hl: (v) => v / 1000,
    dl_to_m3: (v) => v / 10_000,

    /* ===== DECALITRE ===== */
    dal_to_ml: (v) => v * 10_000,
    dal_to_cl: (v) => v * 1000,
    dal_to_dl: (v) => v * 100,
    dal_to_l: (v) => v * 10,
    dal_to_hl: (v) => v / 10,
    dal_to_m3: (v) => v / 100,

    /* ===== HECTOLITRE ===== */
    hl_to_ml: (v) => v * 100_000,
    hl_to_cl: (v) => v * 10_000,
    hl_to_dl: (v) => v * 1000,
    hl_to_l: (v) => v * 100,
    hl_to_dal: (v) => v * 10,
    hl_to_m3: (v) => v / 10,

    /* ===== METRE CUBE ===== */
    m3_to_ml: (v) => v * 1_000_000,
    m3_to_cl: (v) => v * 100_000,
    m3_to_dl: (v) => v * 10_000,
    m3_to_l: (v) => v * 1000,
    m3_to_dal: (v) => v * 100,
    m3_to_hl: (v) => v * 10,

    /* ================= METRIQUE → US ================= */
    l_to_gal_us: (v) => v / 3.78541,
    l_to_pint_us: (v) => v / 0.473176,
    l_to_cup_us: (v) => v / 0.24,
    l_to_fl_oz_us: (v) => v / 0.0295735,

    ml_to_gal_us: (v) => v / 3785.41,
    ml_to_pint_us: (v) => v / 473.176,
    ml_to_cup_us: (v) => v / 240,
    ml_to_fl_oz_us: (v) => v / 29.5735,

    cl_to_gal_us: (v) => v / 378.541,

    cl_to_pint_us: (v) => v / 47.3176,
    cl_to_cup_us: (v) => v / 24,
    cl_to_fl_oz_us: (v) => v / 2.95735,

    dl_to_gal_us: (v) => v / 37.8541,
    dl_to_pint_us: (v) => v / 4.73176,
    dl_to_cup_us: (v) => v / 2.4,
    dl_to_fl_oz_us: (v) => v / 0.295735,

    dal_to_gal_us: (v) => v * 2.64172,
    dal_to_pint_us: (v) => v * 21.1338,
    dal_to_cup_us: (v) => v * 41.6667,
    dal_to_fl_oz_us: (v) => v * 338.14,

    hl_to_gal_us: (v) => v * 26.4172,
    hl_to_pint_us: (v) => v * 211.338,
    hl_to_cup_us: (v) => v * 416.667,
    hl_to_fl_oz_us: (v) => v * 3381.4,

    m3_to_gal_us: (v) => v * 264.172,
    m3_to_pint_us: (v) => v * 2113.38,
    m3_to_cup_us: (v) => v * 4166.67,
    m3_to_fl_oz_us: (v) => v * 33814,

    /* ================= US → METRIQUE ================= */

    gal_us_to_l: (v) => v * 3.78541,
    pint_us_to_l: (v) => v * 0.473176,
    cup_us_to_l: (v) => v * 0.24,
    fl_oz_us_to_l: (v) => v * 0.0295735,

    gal_us_to_ml: (v) => v * 3785.41,
    pint_us_to_ml: (v) => v * 473.176,
    cup_us_to_ml: (v) => v * 240,
    fl_oz_us_to_ml: (v) => v * 29.5735,

    gal_us_to_cl: (v) => v * 378.541,
    pint_us_to_cl: (v) => v * 47.3176,
    cup_us_to_cl: (v) => v * 24,
    fl_oz_us_to_cl: (v) => v * 2.95735,

    gal_us_to_dl: (v) => v * 37.8541,
    pint_us_to_dl: (v) => v * 4.73176,
    cup_us_to_dl: (v) => v * 2.4,
    fl_oz_us_to_dl: (v) => v * 0.295735,

    gal_us_to_dal: (v) => v / 2.64172,
    pint_us_to_dal: (v) => v / 21.1338,
    cup_us_to_dal: (v) => v / 41.6667,
    fl_oz_us_to_dal: (v) => v / 338.14,

    gal_us_to_hl: (v) => v / 26.4172,
    pint_us_to_hl: (v) => v / 211.338,
    cup_us_to_hl: (v) => v / 416.667,
    fl_oz_us_to_hl: (v) => v / 3381.4,

    gal_us_to_m3: (v) => v / 264.172,
    pint_us_to_m3: (v) => v / 2113.38,
    cup_us_to_m3: (v) => v / 4166.67,
    fl_oz_us_to_m3: (v) => v / 33814,

    /* ===== AJOUT BARIL ===== */
    l_to_bbl: (v) => v / 158.9873,
    bbl_to_l: (v) => v * 158.9873,

    gal_us_to_bbl: (v) => v / 42,
    bbl_to_gal_us: (v) => v * 42,
  },

  ENERGY: {
    j_to_kcal: (v) => v / 4184,
    j_to_kwh: (v) => v / 3.6e6,
    j_to_btu: (v) => v / 1055.06,

    kcal_to_j: (v) => v * 4184,
    kwh_to_j: (v) => v * 3.6e6,
    btu_to_j: (v) => v * 1055.06,
  },

  TIME: {
    /* ===== BASE SECOND ===== */
    s_to_mls: (v) => v * 1000,
    s_to_min: (v) => v / 60,
    s_to_h: (v) => v / 3600,
    s_to_day: (v) => v / 86400,
    s_to_week: (v) => v / 604800,

    /* ===== MILLISECOND ===== */
    mls_to_s: (v) => v / 1000,
    mls_to_min: (v) => v / 60_000,
    mls_to_h: (v) => v / 3_600_000,

    /* ===== MINUTE ===== */
    min_to_mls: (v) => v * 60_000,
    min_to_s: (v) => v * 60,
    min_to_h: (v) => v / 60,
    min_to_day: (v) => v / 1440,

    /* ===== HOUR ===== */
    h_to_mls: (v) => v * 3_600_000,
    h_to_s: (v) => v * 3600,
    h_to_min: (v) => v * 60,
    h_to_day: (v) => v / 24,
    h_to_week: (v) => v / 168,

    /* ===== DAY ===== */
    day_to_s: (v) => v * 86400,
    day_to_min: (v) => v * 1440,
    day_to_h: (v) => v * 24,
    day_to_week: (v) => v / 7,

    /* ===== WEEK ===== */
    week_to_s: (v) => v * 604800,
    week_to_min: (v) => v * 10080,
    week_to_h: (v) => v * 168,
    week_to_day: (v) => v * 7,
  },

  AREA: {
    /* ===== BASE SQUARE METRE ===== */
    m2_to_cm2: (v) => v * 10_000,
    m2_to_mm2: (v) => v * 1_000_000,
    m2_to_km2: (v) => v / 1_000_000,
    m2_to_are: (v) => v / 100,
    m2_to_hectare: (v) => v / 10_000,

    m2_to_ft2: (v) => v * 10.7639104167,
    m2_to_yd2: (v) => v * 1.1959900463,
    m2_to_acre: (v) => v / 4046.8564224,

    /* ===== SQUARE MILLIMETRE ===== */
    mm2_to_m2: (v) => v / 1_000_000,
    mm2_to_cm2: (v) => v / 100,

    /* ===== SQUARE CENTIMETRE ===== */
    cm2_to_mm2: (v) => v * 100,
    cm2_to_m2: (v) => v / 10_000,

    /* ===== SQUARE KILOMETRE ===== */
    km2_to_m2: (v) => v * 1_000_000,
    km2_to_hectare: (v) => v * 100,
    km2_to_acre: (v) => v * 247.105381467,

    /* ===== ARE ===== */
    are_to_m2: (v) => v * 100,
    are_to_hectare: (v) => v / 100,

    /* ===== HECTARE ===== */
    hectare_to_m2: (v) => v * 10_000,
    hectare_to_are: (v) => v * 100,
    hectare_to_acre: (v) => v * 2.47105381467,

    /* ===== US / IMPERIAL ===== */
    ft2_to_m2: (v) => v / 10.7639104167,
    yd2_to_m2: (v) => v / 1.1959900463,
    acre_to_m2: (v) => v * 4046.8564224,
  },

  DATA: {
    /* ===== BIT ===== */
    bit_to_byte: (v) => v / 8,
    bit_to_kb: (v) => v / (8 * 1024),
    bit_to_mb: (v) => v / (8 * 1024 ** 2),
    bit_to_gb: (v) => v / (8 * 1024 ** 3),

    /* ===== BYTE ===== */
    byte_to_bit: (v) => v * 8,
    byte_to_kb: (v) => v / 1024,
    byte_to_mb: (v) => v / 1024 ** 2,
    byte_to_gb: (v) => v / 1024 ** 3,
    byte_to_tb: (v) => v / 1024 ** 4,

    /* ===== KILOBYTE ===== */
    kb_to_bit: (v) => v * 1024 * 8,
    kb_to_byte: (v) => v * 1024,
    kb_to_mb: (v) => v / 1024,
    kb_to_gb: (v) => v / 1024 ** 2,
    kb_to_tb: (v) => v / 1024 ** 3,

    /* ===== MEGABYTE ===== */
    mb_to_bit: (v) => v * 1024 ** 2 * 8,
    mb_to_byte: (v) => v * 1024 ** 2,
    mb_to_kb: (v) => v * 1024,
    mb_to_gb: (v) => v / 1024,
    mb_to_tb: (v) => v / 1024 ** 2,

    /* ===== GIGABYTE ===== */
    gb_to_bit: (v) => v * 1024 ** 3 * 8,
    gb_to_byte: (v) => v * 1024 ** 3,
    gb_to_kb: (v) => v * 1024 ** 2,
    gb_to_mb: (v) => v * 1024,
    gb_to_tb: (v) => v / 1024,

    /* ===== TERABYTE ===== */
    tb_to_bit: (v) => v * 1024 ** 4 * 8,
    tb_to_byte: (v) => v * 1024 ** 4,
    tb_to_kb: (v) => v * 1024 ** 3,
    tb_to_mb: (v) => v * 1024 ** 2,
    tb_to_gb: (v) => v * 1024,
  },
};
