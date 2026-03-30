// frontend/src/assets/dummyStyles.ts — AROHAK Brand: Crimson Red · Gold · Light

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
export const navbarStyles = {
  navbar: "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
  navbarVisible: "translate-y-0 opacity-100",
  navbarHidden: "-translate-y-full opacity-0",
  navbarScrolled: "bg-white/95 backdrop-blur-xl shadow-sm py-2 border-b border-red-100",
  navbarDefault: "bg-white/95 backdrop-blur-xl py-3 border-b border-red-100",
  container: "max-w-6xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8",
  innerContainer: "flex items-center justify-between h-12",
  logo: "flex items-center space-x-3 group cursor-pointer flex-shrink-0",
  logoIconContainer: "relative",
  logoIcon: "w-8 h-8 bg-gradient-to-br from-red-600 to-amber-500 rounded-lg flex items-center justify-center transform transition-all duration-300 shadow-sm",
  logoIconGlow: "absolute -inset-1 bg-red-200 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity duration-300",
  logoText: "font-bold text-lg bg-gradient-to-r from-red-700 to-amber-600 bg-clip-text text-transparent",
  desktopNav: "hidden lg:flex items-center justify-center flex-1 max-w-2xl",
  desktopNavContainer: "flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-2xl p-1.5 shadow-sm border border-red-100",
  desktopNavItem: "group relative px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2",
  desktopNavItemActive: "bg-gradient-to-r from-red-50 to-amber-50 text-red-700 shadow-sm",
  desktopNavIcon: "text-gray-500 transition-colors duration-300 group-hover:text-red-600",
  desktopNavText: "text-sm font-medium text-gray-700 group-hover:text-red-600",
  authContainer: "flex items-center space-x-3 flex-shrink-0",
  loginButton: "hidden lg:flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white text-sm font-semibold shadow-sm hover:shadow-md transform transition-all duration-300 group",
  logoutButton: "hidden lg:flex items-center space-x-2 px-4 py-2 rounded-xl bg-white text-sm font-semibold shadow-sm hover:shadow-md transform transition-all duration-300 group border border-red-100",
  mobileMenuButton: "lg:hidden p-2 rounded-xl bg-white shadow-sm border border-red-100 text-gray-600 hover:text-red-600 hover:shadow-md transition-all duration-300",
  mobileMenu: "lg:hidden transition-all duration-500 overflow-hidden",
  mobileMenuOpen: "max-h-[500px] opacity-100 mt-3",
  mobileMenuClosed: "max-h-0 opacity-0",
  mobileMenuContainer: "bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-red-100",
  mobileMenuItems: "space-y-2",
  mobileMenuItem: "flex items-center space-x-3 p-3 rounded-xl transition-all duration-300",
  mobileMenuItemActive: "bg-red-50",
  mobileMenuItemHover: "hover:bg-red-50",
  mobileMenuIconContainer: "p-2 rounded-lg bg-red-50 transition-colors duration-300",
  mobileMenuIcon: "text-red-600",
  mobileMenuText: "font-medium text-gray-700",
  mobileLoginButton: "w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-300 mt-2",
  mobileLogoutButton: "w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-white text-gray-800 font-semibold shadow-sm border border-red-100 hover:shadow-md transition-all duration-300 mt-2",
  backgroundPattern: "absolute inset-0 -z-10 opacity-[0.04]",
  pattern: "absolute inset-0 bg-[linear-gradient(to_right,#fca5a5_1px,transparent_1px),linear-gradient(to_bottom,#fca5a5_1px,transparent_1px)] [background-size:32px_32px]",
  createAccountButton: "hidden lg:flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white text-sm font-semibold shadow-sm hover:shadow-md transform transition-all duration-300 group",
  mobileCreateAccountButton: "w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-300 mt-2",
};

// ─── BANNER ──────────────────────────────────────────────────────────────────
export const bannerStyles = {
  container: "relative md:pt-25 xl:pt-25 pt-21 sm:min-h-[520px] md:min-h-[560px] lg:min-h-[600px] pt-6 sm:pt-20 lg:pt-25 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 bg-gradient-to-b from-white via-red-50/30 to-amber-50/20 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-red-100",
  floatingIconsWrapper: "absolute inset-0 pointer-events-none overflow-visible z-0",
  floatingIcon: "absolute animate-float max-w-none pb-4 md:-ml-11.5 md:mt-2 lg:-mr-12 lg:-ml-13 xl:-mr-0 xl:-ml-0 xl:mt-5 xl:w-12 xl:h-40 md:-mr-12 lg:-mr-0 pointer-events-none drop-shadow-lg transform transition-transform duration-300 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12",
  mainContent: "max-w-6xl w-full mx-auto bg-white backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-red-100 relative z-10 p-6 sm:p-8 lg:p-12 animate-fade-in",
  grid: "grid grid-cols-1 md:grid-cols-2 gap-8 items-center",
  leftContent: "space-y-5 sm:space-y-6",
  badge: "inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-semibold animate-fade-in font-cursive",
  badgeIcon: "w-4 h-4 text-red-500",
  heading: "text-3xl sm:text-4xl lg:text-5xl font-cursive font-heading uppercase tracking-wider leading-tight",
  headingSpan1: "block text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-red-600 to-amber-600",
  headingSpan2: "block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-red-600 to-red-700",
  videoModal: {
    overlay: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn",
    container: "relative w-[90%] max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20",
    iframe: "w-full h-full",
    closeButton: "absolute top-3 cursor-pointer right-3 bg-white hover:bg-gray-100 text-black font-bold rounded-full p-2 shadow-lg transition-all duration-200",
    closeIcon: "w-5 h-5",
  },
  description: "text-lg sm:text-xl font-body italic font-[pacifico] font-semibold text-slate-600 leading-relaxed mt-2 sm:mt-4",
  featuresGrid: "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 animate-fade-in opacity-0 animation-delay-700",
  featureItem: "flex items-center space-x-3",
  featureIconContainer: "w-6 h-6 flex items-center justify-center shrink-0",
  featureIcon: "text-red-500",
  featureText: "text-slate-700 font-cursive text-sm sm:text-base",
  buttonsContainer: "flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 animate-fade-in opacity-0 animation-delay-900",
  buttonGetStarted: "px-6 py-3 sm:px-8 sm:py-3 bg-gradient-to-r from-red-600 to-amber-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform font-cursive text-sm sm:text-base text-center",
  buttonViewDemo: "px-6 py-3 sm:px-8 sm:py-3 bg-white cursor-pointer text-slate-700 font-semibold rounded-xl border border-red-100 shadow-sm hover:shadow-md transition-all duration-300 transform font-cursive text-sm sm:text-base text-center",
  imageContainer: "flex items-center justify-center",
  image: "w-full max-w-[220px] sm:max-w-sm md:max-w-md lg:max-w-sm h-auto rounded-2xl shadow-xl border border-red-100 animate-float",
};

export const animationDelays = {
  delay300: "animation-delay-300",
  delay500: "animation-delay-500",
  delay700: "animation-delay-700",
  delay900: "animation-delay-900",
};

export const customStyles = `
@import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap");
.font-cursive { font-family: "Dancing Script", cursive; }
@keyframes fade-in { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
@keyframes float { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-12px) rotate(3deg);} }
@keyframes float-slow { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-15px) rotate(5deg);} }
@keyframes text-gradient { 0%{background-position:0% 50%;} 50%{background-position:100% 50%;} 100%{background-position:0% 50%;} }
.animate-float { animation: float 4s ease-in-out infinite; }
.animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
.animate-fade-in { animation: fade-in 0.9s ease-out forwards; }
.animate-text-gradient { background-size:200% 200%; animation: text-gradient 4s ease infinite; }
.glow-icon { filter:drop-shadow(0 0 10px rgba(192,57,43,0.3)); transition:transform 0.35s ease,filter 0.35s ease,opacity 0.35s ease; opacity:0.98; }
.glow-icon:hover { transform:scale(1.12); filter:drop-shadow(0 0 14px rgba(192,57,43,0.55)); }
.animation-delay-300 { animation-delay:0.3s; }
.animation-delay-500 { animation-delay:0.5s; }
.animation-delay-700 { animation-delay:0.7s; }
.animation-delay-900 { animation-delay:0.9s; }
img { object-fit:contain; }
@media (max-width:420px) { .glow-icon { width:22px !important; height:22px !important; } }
@keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
`;

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
export const aboutUsStyles = {
  container: "min-h-screen bg-gradient-to-br from-red-50 via-white to-amber-50",
  heroSection: "relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden",
  heroBackground: "absolute inset-0 z-0",
  heroImageContainer: "absolute inset-0 bg-cover bg-center transform scale-105",
  heroVignette: "absolute inset-0 pointer-events-none",
  heroTint: "absolute inset-0 bg-slate-900/30 mix-blend-multiply pointer-events-none",
  heroContent: "relative z-20 max-w-7xl mx-auto text-center",
  trustBadge: "inline-flex items-center px-6 py-3 rounded-full bg-white/10 text-white text-lg mb-8 backdrop-blur-sm border border-white/30 shadow-sm",
  trustIcon: "w-5 h-5 mr-2 fill-current",
  mainHeading: "text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 font-serif tracking-tight drop-shadow-lg",
  subHeading: "text-xl md:text-2xl text-red-100 max-w-4xl mx-auto leading-relaxed mb-8 drop-shadow",
  inlineHighlight: "inline-block ml-2 px-2 py-1 text-red-100 rounded-full font-semibold",
  statsGrid: "grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto",
  statCard: "text-center p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20",
  statNumber: "text-2xl font-bold text-white drop-shadow-sm",
  statLabel: "text-red-100 text-sm",
  sectionContainer: "py-20 px-4 sm:px-6 lg:px-8",
  sectionGrid: "max-w-7xl mx-auto",
  sectionContentGrid: "grid lg:grid-cols-2 md:grid-cols-2 gap-16 items-center",
  sectionImageContainer: "relative",
  sectionImage: "relative group",
  sectionContent: "",
  sectionBadge: "inline-flex items-center px-4 py-2 rounded-full bg-white shadow-lg mb-6",
  sectionIcon: "w-5 h-5 mr-2",
  sectionBadgeText: "font-semibold text-gray-700",
  sectionTitle: "text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-serif",
  sectionDescription: "text-xl text-gray-600 mb-8 leading-relaxed",
  featuresContainer: "space-y-4 mb-8",
  featureItem: "flex items-center gap-4 group",
  featureIcon: "w-8 h-8 bg-gradient-to-r from-red-600 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0 transition-transform",
  featureIconSvg: "w-5 h-5 text-white",
  featureText: "text-lg text-gray-700 font-medium",
  certificates: "w-4 h-4",
  valuesSection: "py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-amber-50",
  valuesHeader: "text-center mb-16",
  valuesBadge: "inline-flex items-center px-6 py-3 rounded-full bg-white shadow-lg mb-6",
  valuesBadgeIcon: "w-6 h-6 text-red-600 mr-2",
  valuesBadgeText: "font-semibold text-gray-700",
  valuesTitle: "text-2xl sm:text-5xl font-bold text-gray-900 mb-4 font-serif",
  valuesSubtitle: "text-xl text-gray-600 max-w-2xl mx-auto",
  valuesGrid: "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8",
  valueCard: "bg-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 group border border-red-100 relative overflow-hidden",
  valueGradient: "absolute inset-0 bg-gradient-to-br from-red-600 to-amber-500 opacity-5 group-hover:opacity-10 transition-opacity duration-500",
  valueCardTitle: "text-2xl font-bold font-[pacifico] text-gray-900 mb-4 relative z-10 truncate",
  valueCardDescription: "text-gray-600 leading-relaxed mb-6 relative z-10",
  valueFeatures: "space-y-3 relative z-10",
  valueFeatureItem: "flex items-center gap-3 text-gray-700",
  valueFeatureDot: "w-2 h-2 bg-gradient-to-r from-red-600 to-amber-500 rounded-full",
  valueUnderline: "absolute bottom-0 left-0 w-0 group-hover:w-full h-1 bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-500",
  teamSection: "py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-amber-50",
  teamHeader: "text-center mb-16",
  teamTitle: "text-2xl sm:text-4xl font-bold text-gray-900 mb-4 font-serif",
  teamSubtitle: "text-xl text-gray-600 max-w-2xl mx-auto",
  teamGrid: "grid md:grid-cols-2 lg:grid-cols-4 gap-8",
  teamMember: "text-center font-[pacifico] group cursor-pointer",
  teamImageContainer: "relative mb-6",
  teamImage: "w-48 h-48 mx-auto rounded-full transform transition-all duration-500",
  teamName: "text-2xl font-bold text-gray-900 mb-2 transition-colors",
  teamRole: "text-red-600 italic font-semibold mb-2",
  teamBio: "text-gray-600 mb-4",
  testimonialsSection: "py-20 px-4 sm:px-6 lg:px-8 bg-white",
  testimonialsHeader: "text-center mb-16",
  testimonialsTitle: "text-2xl sm:text-4xl font-bold text-gray-900 mb-4 font-serif",
  testimonialsSubtitle: "text-xl text-gray-600 max-w-2xl mx-auto",
  testimonialsGrid: "grid md:grid-cols-3 gap-8",
  testimonialCard: "bg-red-50 p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 group border border-red-100",
  testimonialStars: "flex items-center gap-2 mb-4",
  testimonialStar: "w-5 h-5 text-amber-500 fill-current",
  testimonialText: "text-gray-700 mb-6 leading-relaxed italic",
  testimonialAuthor: "flex items-center gap-4",
  testimonialAvatar: "w-12 h-12 rounded-full object-cover",
  testimonialAuthorName: "font-semibold text-gray-900",
  testimonialAuthorRole: "text-gray-600 text-sm",
  ctaSection: "py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-700 via-red-600 to-amber-600 relative overflow-hidden",
  ctaOrb1: "absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse",
  ctaOrb2: "absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 animate-pulse animation-delay-2000",
  ctaContent: "relative max-w-4xl mx-auto text-center",
  ctaTitle: "text-5xl md:text-6xl font-bold text-white mb-6 font-serif",
  ctaDescription: "text-xl text-red-100 mb-12 max-w-2xl mx-auto leading-relaxed",
  ctaButtons: "flex flex-col sm:flex-row gap-6 justify-center items-center mb-8",
  ctaButton: "group bg-transparent cursor-pointer border-2 border-white text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-3 backdrop-blur-sm hover:shadow-2xl",
  ctaButtonIcon: "w-5 h-5 group-hover:scale-110 transition-transform",
};

export const aboutUsAnimations = `
@keyframes float { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-20px) rotate(180deg);} }
.animate-float { animation: float 6s ease-in-out infinite; }
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-3000 { animation-delay: 3s; }
.animation-delay-4000 { animation-delay: 4s; }
.text-gradient { background-clip:text; -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
`;

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
export const contactStyles = {
  container: "min-h-screen bg-gradient-to-br from-white to-red-50 py-10 px-4 sm:px-6 md:px-10 lg:px-12 overflow-x-hidden",
  mainContainer: "max-w-7xl mx-auto",
  header: "text-center mb-12 sm:mb-16",
  title: "text-3xl sm:text-4xl md:text-5xl inline-flex items-center space-x-2 mt-15 rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-red-100 font-bold bg-gradient-to-r from-red-700 to-amber-600 bg-clip-text text-transparent font-['Poppins']",
  mainSection: "grid grid-cols-1 font-serif lg:grid-cols-2 md:grid-cols-2 md:gap-2 gap-10 lg:gap-12 items-center",
  formContainer: "relative order-2 lg:order-1",
  formGlow1: "absolute -inset-1 bg-gradient-to-r from-red-400 to-amber-400 rounded-2xl opacity-75 blur-sm animate-pulse",
  formGlow2: "absolute -inset-1 bg-gradient-to-r from-red-400 to-amber-400 rounded-2xl opacity-50 animate-pulse delay-75",
  formGlow3: "absolute -inset-1 bg-gradient-to-r from-red-400 to-amber-400 rounded-2xl opacity-25 animate-pulse delay-150",
  form: "relative bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-red-100",
  formElements: "space-y-6",
  formGrid: "grid grid-cols-1 md:grid-cols-2 gap-6",
  formGroup: "group",
  label: "block text-sm font-medium text-gray-700 mb-2 flex items-center",
  labelIcon: "w-4 h-4 mr-2",
  input: "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-300 bg-white",
  inputError: "border-red-500",
  errorText: "mt-2 text-sm text-red-600",
  textarea: "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-300 bg-white resize-none",
  select: "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:border-transparent transition-all duration-300 bg-white",
  colors: {
    purple: { icon: "text-red-600", focus: "focus:ring-red-500", hover: "group-hover:border-red-400" },
    blue: { icon: "text-amber-600", focus: "focus:ring-amber-500", hover: "group-hover:border-amber-400" },
    green: { icon: "text-green-600", focus: "focus:ring-green-500", hover: "group-hover:border-green-400" },
  },
  submitButton: "w-full py-4 px-6 rounded-full font-bold text-white transition-all duration-300 flex items-center justify-center",
  submitButtonEnabled: "bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 shadow-lg hover:shadow-xl",
  submitButtonDisabled: "bg-gray-400 cursor-not-allowed",
  spinner: "w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2",
  submitIcon: "w-5 h-5 mr-2",
  animationContainer: "relative order-1 xl:order-2 lg:order-2 w-full flex justify-center items-center",
  animationWrapper: "relative max-w-md sm:max-w-lg md:max-w-xl lg:max-w-full xl:max-w-full rounded-2xl overflow-hidden",
  footer: "mt-12 sm:mt-16 text-center",
  footerBadge: "inline-flex items-center space-x-2 bg-gradient-to-r from-red-50 to-amber-50 rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-red-100",
  footerIcon: "w-5 h-5 text-red-600",
  footerText: "text-gray-700 text-sm sm:text-base",
};

// ─── COURSE PAGE ─────────────────────────────────────────────────────────────
export const coursePageStyles = {
  pageContainer: "min-h-screen pt-24 bg-gradient-to-br from-white via-red-50/30 to-amber-50/20 py-8 px-4 relative overflow-hidden",
  headerContainer: "text-center mb-12 md:mb-16 relative z-10",
  headerTransform: "mb-6",
  headerTitle: "text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-red-600 to-amber-600 tracking-tight font-[pacifico]",
  headerSubtitle: "text-base sm:text-lg md:text-2xl text-gray-700 font-light mb-6 md:mb-8 tracking-wide",
  searchContainer: "max-w-2xl mx-auto mb-10 relative group px-2 sm:px-0",
  searchGradient: "absolute -inset-1 bg-gradient-to-r from-red-500 via-red-600 to-amber-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none",
  searchInputContainer: "relative z-10 flex items-center bg-white/90 backdrop-blur-lg border border-red-100 group-hover:border-red-400 rounded-3xl shadow-xl transition-all duration-500",
  searchIconContainer: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
  searchIcon: "w-5 h-5 text-red-500",
  searchInput: "w-full pl-12 pr-10 py-3 rounded-3xl bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none font-medium text-sm sm:text-base",
  clearButton: "absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors duration-300",
  resultsCount: "text-gray-600 text-sm sm:text-base",
  noCoursesContainer: "text-center py-12",
  noCoursesIcon: "w-16 h-16 mx-auto text-gray-400",
  noCoursesTitle: "text-xl font-semibold text-gray-600 mb-2",
  noCoursesButton: "mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto",
  coursesGrid: "max-w-7xl font-[pacifico] mx-auto relative z-10",
  coursesGridContainer: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10",
  courseCard: "group transition-all duration-500 ease-out cursor-pointer",
  courseCardInner: "relative transition-transform duration-500 ease-out h-full",
  courseCardContent: "backdrop-blur-lg rounded-3xl shadow-xl border border-red-100 h-full flex flex-col bg-white/80 overflow-hidden",
  courseImageContainer: "relative overflow-hidden rounded-t-3xl h-48 sm:h-44 md:h-48",
  courseImage: "w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105",
  courseInfo: "p-4 sm:p-6 flex-1 flex flex-col",
  courseName: "text-base sm:text-lg font-bold text-gray-900 leading-tight line-clamp-2 mb-2",
  teacherContainer: "flex items-center space-x-2 mb-3 text-sm",
  teacherIcon: "w-4 h-4 text-red-500",
  teacherName: "text-gray-600 font-medium truncate",
  ratingContainer: "mb-3",
  ratingStars: "flex items-center space-x-2 mb-2",
  ratingStarsInner: "flex space-x-1",
  ratingStarButton: "p-1 rounded-full focus:outline-none",
  priceContainer: "mt-auto flex items-center justify-between",
  priceFree: "text-2xl font-bold text-green-600",
  priceCurrent: "text-2xl font-bold text-green-600",
  priceOriginal: "text-lg text-gray-500 line-through",
  showMoreContainer: "mt-10 flex justify-center px-2 sm:px-0",
  showMoreButton: "px-5 py-3 rounded-full cursor-pointer bg-white/80 backdrop-blur-sm border border-red-100 shadow hover:shadow-md transition-all duration-300 flex items-center space-x-3 w-full sm:w-auto justify-center",
  showMoreText: "text-sm font-medium text-gray-800",
};

export const coursePageCustomStyles = `
.perspective-1000 { perspective: 1000px; }
.transform-style-3d { transform-style: preserve-3d; }
.line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
@keyframes gradient-x { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }
.animate-gradient-x { background-size:200% 200%; animation:gradient-x 6s ease infinite; }
`;

// ─── MY COURSES ───────────────────────────────────────────────────────────────
export const myCoursesStyles = {
  pageContainer: "min-h-screen bg-gradient-to-br from-white to-red-50 py-8 font-[pacifico]",
  mainContainer: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  header: "text-4xl font-bold text-gray-800 mb-12 text-center",
  emptyHeader: "text-4xl font-bold text-gray-800 mb-6",
  emptyText: "text-gray-600 text-lg",
  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8",
  courseCard: "group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-red-100 cursor-pointer",
  imageContainer: "relative overflow-hidden",
  courseImage: "w-full h-48 object-contain pb-7.5 lg:pb-6 xl:pb-8.5 transition-transform duration-700",
  courseContent: "p-5",
  courseName: "text-lg font-bold text-gray-800 mb-3 line-clamp-2 transition-colors duration-300",
  infoContainer: "flex items-center justify-between mb-4",
  ratingContainer: "flex items-center space-x-1 bg-amber-50 rounded-full px-3 py-1 border border-amber-100",
  ratingIcon: "w-4 h-4 text-amber-500 fill-current",
  ratingText: "text-sm font-semibold text-gray-800",
  teacherContainer: "flex items-center space-x-1 bg-red-50 rounded-full px-3 py-1 border border-red-100",
  teacherIcon: "w-4 h-4 text-red-600",
  teacherText: "text-sm font-medium text-gray-800 truncate max-w-[80px]",
  viewButton: "w-full bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-semibold py-3 px-4 rounded-full transition-all duration-300 transform shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 cursor-pointer group/btn",
  buttonIcon: "w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110",
  buttonText: "",
};

export const myCoursesCustomStyles = `
@keyframes fadeInUp { from{opacity:0;transform:translateY(30px);} to{opacity:1;transform:translateY(0);} }
`;

// ─── FOOTER ───────────────────────────────────────────────────────────────────
export const footerStyles = {
  footer: "relative bg-gradient-to-br from-white via-red-50/30 to-amber-50/20 text-slate-800 overflow-hidden border-t border-red-100",
  container: "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16",
  grid: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 sm:gap-12 mb-12 sm:mb-16",
  brandSection: "lg:col-span-1",
  brandTransform: "transform transition-transform duration-500",
  brandContainer: "relative mb-4 sm:mb-6 group",
  brandGradient: "absolute -inset-3 bg-gradient-to-r from-red-400 to-amber-400 rounded-2xl blur-lg opacity-10 transition-all duration-500 pointer-events-none",
  brandTitle: "text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-amber-600 py-1",
  brandDescription: "text-slate-600 leading-relaxed mb-4 text-sm sm:text-sm",
  sectionHeader: "text-lg font-semibold mb-4 text-slate-700 flex items-center gap-2",
  sectionIcon: "w-5 h-5",
  linksList: "space-y-2",
  linkItem: "text-slate-600 transition-all duration-300 transform hover:translate-x-2 flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 min-w-0",
  linkIcon: "w-4 h-4 flex-shrink-0",
  contactSpace: "space-y-3 text-slate-600",
  contactItem: "flex items-center group transform transition-all duration-300 p-3 rounded-xl",
  contactIconContainer: "flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mr-3 sm:mr-4 transform transition-transform duration-300 shadow-lg border border-white overflow-hidden",
  contactIcon: "w-4 h-4",
  contactTextContainer: "min-w-0",
  contactTextPrimary: "font-medium text-sm break-words",
  contactTextSecondary: "text-xs text-slate-500",
  socialSection: "border-t border-red-100 pt-8",
  socialContainer: "flex flex-col lg:flex-row items-center justify-between gap-6",
  socialIconsContainer: "flex flex-wrap items-center gap-3 sm:gap-4 justify-center lg:justify-start",
  socialIconLink: "relative group transform transition-all duration-300 hover:scale-105",
  socialIconContainer: "relative w-10 h-10 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border border-red-100 shadow-md backdrop-blur-sm overflow-hidden",
  socialIconInner: "absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
  socialIcon: "w-5 h-5 sm:w-6 sm:h-6 text-slate-700",
  socialTooltip: "absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none hidden md:block",
  socialTooltipArrow: "absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45",
  designCredit: "text-center lg:text-right",
  designCreditContainer: "relative inline-block group",
  designCreditGradient: "absolute -inset-1 bg-gradient-to-r from-red-400 to-amber-400 rounded-xl blur-lg opacity-10 group-hover:opacity-25 transition-all duration-500 pointer-events-none",
  designCreditText: "relative font-[pacifico] text-slate-600 text-sm bg-white/80 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-3 border border-red-100 shadow-sm inline-flex items-center gap-2",
  designCreditLink: "ml-1 font-medium text-slate-700 hover:text-red-600 transition-colors duration-300",
  bransSection: "lg:col-span-1",
};

export const footerBackgroundStyles = {
  backgroundContainer: "absolute inset-0 pointer-events-none",
  floatingOrb1: "hidden sm:block absolute top-10 left-10 w-24 h-24 bg-gradient-to-r from-red-200/30 to-amber-200/20 rounded-full blur-xl animate-float-1",
  floatingOrb2: "hidden sm:block absolute top-32 right-20 w-32 h-32 bg-gradient-to-r from-amber-200/20 to-red-200/15 rounded-full blur-xl animate-float-2",
  floatingOrb3: "hidden sm:block absolute bottom-20 left-1/4 w-28 h-28 bg-gradient-to-r from-red-100/20 to-amber-100/15 rounded-full blur-xl animate-float-3",
  floatingOrb4: "hidden sm:block absolute bottom-32 right-32 w-20 h-20 bg-gradient-to-r from-amber-200/20 to-red-200/15 rounded-full blur-xl animate-float-4",
  gridOverlay: "absolute inset-0 opacity-[0.02] pointer-events-none",
};

export const contactIconGradients = {
  address: "bg-gradient-to-br from-red-100 to-amber-100",
  phone: "bg-gradient-to-br from-amber-100 to-red-100",
  email: "bg-gradient-to-br from-red-50 to-amber-50",
};

export const iconColors = {
  cyan: "text-red-500",
  purple: "text-amber-500",
  emerald: "text-green-500",
  cyan600: "text-red-600",
  purple600: "text-amber-600",
  emerald600: "text-green-600",
};

export const footerCustomStyles = `
@keyframes float-1 { 0%,100%{transform:translateY(0px) rotate(0deg) scale(1);} 33%{transform:translateY(-12px) rotate(3deg) scale(1.03);} 66%{transform:translateY(-6px) rotate(-2deg) scale(0.98);} }
@keyframes float-2 { 0%,100%{transform:translateY(0px) rotate(0deg) scale(1);} 25%{transform:translateY(-18px) rotate(-4deg) scale(1.06);} 75%{transform:translateY(-4px) rotate(2deg) scale(0.96);} }
@keyframes float-3 { 0%,100%{transform:translateY(0px) rotate(0deg) scale(1);} 50%{transform:translateY(-10px) rotate(5deg) scale(1.02);} }
@keyframes float-4 { 0%,100%{transform:translateY(0px) rotate(0deg) scale(1);} 40%{transform:translateY(-14px) rotate(-3deg) scale(1.05);} 80%{transform:translateY(-5px) rotate(4deg) scale(0.98);} }
.animate-float-1 { animation: float-1 9s ease-in-out infinite; }
.animate-float-2 { animation: float-2 11s ease-in-out infinite; }
.animate-float-3 { animation: float-3 13s ease-in-out infinite; }
.animate-float-4 { animation: float-4 10s ease-in-out infinite; }
`;

// ─── HOME COURSES ─────────────────────────────────────────────────────────────
export const homeCoursesStyles = {
  container: "bg-gradient-to-b from-white via-red-50/20 to-amber-50/10 min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-12",
  mainContainer: "max-w-7xl mx-auto",
  header: "flex flex-col items-center gap-6",
  title: "text-3xl sm:text-4xl md:text-4xl mb-0 text-center bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-transparent bg-clip-text flex items-center justify-center gap-3",
  titleIcon: "w-7 h-7 md:w-8 md:h-8 animate-spin-slow text-red-500",
  coursesGrid: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10",
  courseCard: "cursor-pointer group",
  imageContainer: "relative rounded-2xl xl:rounded-2xl overflow-hidden",
  courseImage: "w-full object-cover transition-transform duration-300 group-hover:shadow-xl h-48 sm:h-48 md:h-40 lg:h-48",
  courseInfo: "mt-4 px-3 bg-white rounded-xl -translate-y-3 sm:-translate-y-5 shadow-md border border-red-100 space-y-2 py-3",
  courseName: "text-base sm:text-lg text-slate-700 flex items-center truncate",
  teacherInfo: "flex items-center text-gray-500 text-sm",
  teacherIcon: "mr-1 text-red-500",
  teacherName: "italic text-gray-600 truncate",
  ratingContainer: "flex items-center mt-1",
  starsContainer: "flex items-center gap-2",
  interactiveStars: "flex",
  starButton: "p-1 sm:p-0.5 focus:outline-none transform transition-transform active:scale-95",
  starButtonActive: "text-amber-500",
  starButtonInactive: "text-gray-300",
  starIcon: "size-4",
  pricingContainer: "flex items-center mt-2 space-x-2",
  freePrice: "text-lg sm:text-xl font-bold text-emerald-600",
  salePrice: "text-lg sm:text-xl font-bold text-emerald-600",
  originalPrice: "line-through text-gray-400 font-medium",
  ctaContainer: "flex justify-center mt-12",
  ctaWrapper: "relative inline-block group",
  ctaGlow: "absolute -inset-1 rounded-full border-0 pointer-events-none",
  ctaButton: "relative z-10 inline-flex items-center gap-4 px-12 py-4 text-xl font-bold rounded-3xl bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-xl transform transition duration-300 cursor-pointer active:scale-95 focus:outline-none",
  ctaButtonContent: "relative flex items-center gap-3",
  ctaText: "",
  ctaIcon: "w-5 h-5 z-10 transition-transform duration-300 group-hover:translate-x-2",
  fonts: { title: "font-[Montserrat] font-bold tracking-wider", course: "font-[Poppins] font-semibold tracking-wide", detail: "font-[Poppins]" },
  animations: `@keyframes spin-slow { from{transform:rotate(0deg);} to{transform:rotate(360deg);} } .animate-spin-slow { animation: spin-slow 6s linear infinite; }`,
};

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
export const testimonialStyles = {
  section: "py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-red-50 via-white to-amber-50",
  container: "max-w-6xl mx-auto text-center mb-12 sm:mb-16",
  badge: "inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-red-100 mb-4 sm:mb-6",
  badgeDot: "w-2 h-2 bg-gradient-to-r from-red-600 to-amber-500 rounded-full animate-pulse",
  badgeText: "text-sm font-medium text-red-700",
  title: "text-3xl sm:text-4xl md:text-5xl font-bold font-[Montserrat] mb-3 sm:mb-6",
  titleGradient: "bg-clip-text text-transparent bg-gradient-to-r from-red-700 via-red-600 to-amber-600",
  subtitle: "text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed",
  grid: "max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 px-2 sm:px-0",
  cardWrapper: "relative group",
  glowBorder: "absolute -inset-2 rounded-3xl bg-gradient-to-r from-red-400/20 via-amber-400/15 to-red-400/20 blur-xl opacity-60 transition-all duration-700 pointer-events-none",
  backgroundPattern: "absolute inset-0 rounded-2xl bg-gradient-to-br from-white/85 to-red-50/30 backdrop-blur-sm border border-white/50 pointer-events-none",
  floatingElement1: "absolute -left-4 -top-4 w-16 h-16 rounded-full bg-gradient-to-br from-red-200/30 to-amber-200/30 blur-xl animate-float-slow pointer-events-none hidden sm:block",
  floatingElement2: "absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-gradient-to-br from-amber-200/30 to-red-200/30 blur-xl animate-float pointer-events-none hidden sm:block",
  card: "relative z-10 bg-white/70 backdrop-blur-md rounded-2xl p-6 sm:p-8 transform transition-all duration-300 card-init hover:shadow-2xl will-change-transform border border-red-100 overflow-hidden",
  cardShadow: "0 20px 60px rgba(192,57,43,0.06), 0 0 0 1px rgba(255,255,255,0.4)",
  courseBadge: "course-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-200/50 mb-4 sm:mb-6",
  courseBadgeDot: "w-2 h-2 bg-gradient-to-r from-red-600 to-amber-500 rounded-full",
  courseBadgeText: "text-sm font-medium text-red-700 truncate",
  quoteIcon: "quote-icon absolute top-4 right-4 text-red-200/60 transform transition-transform duration-500 hidden sm:block",
  quoteIconSvg: "w-10 h-10 sm:w-12 sm:h-12",
  content: "flex items-start gap-4 mb-4 sm:mb-6",
  avatarContainer: "avatar-container relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0 transform transition-transform duration-500",
  avatarWrapper: "relative w-full h-full rounded-2xl overflow-hidden",
  avatarImage: "avatar-img w-full h-full object-cover object-center",
  avatarGlow: "absolute inset-0 rounded-2xl bg-gradient-to-r from-red-400/20 to-amber-400/20 blur-md -z-10 animate-pulse-slow",
  userInfo: "flex-1 min-w-0",
  userHeader: "flex flex-col md:flex-row items-start md:items-center justify-between mb-2 gap-2",
  userName: "font-[Poppins] font-bold text-gray-900 text-base sm:text-lg leading-tight truncate",
  userRole: "text-sm sm:text-sm text-red-600 font-medium truncate",
  ratingContainer: "flex flex-col items-start md:items-end gap-1 mt-2 md:mt-0",
  starsContainer: "flex items-center gap-1 whitespace-nowrap",
  star: "w-4 h-4",
  starActive: "text-amber-500 fill-current",
  starInactive: "text-gray-300",
  message: "text-gray-700 leading-relaxed mb-4 sm:mb-6 relative z-10 text-sm sm:text-base",
  quoteMark: "text-red-400 font-serif text-xl leading-none",
  footer: "flex items-center justify-between pt-3 sm:pt-4 border-t border-red-100 text-xs sm:text-sm",
  verified: "flex items-center gap-2 text-sm text-gray-500",
  verifiedIcon: "w-4 h-4 text-green-400",
  date: "flex items-center gap-2 text-sm text-gray-500",
  dateIcon: "w-4 h-4 text-red-400",
  animations: `
@keyframes float { 0%,100%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(-12px) rotate(5deg);} }
@keyframes float-slow { 0%,100%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(-8px) rotate(-3deg);} }
@keyframes pulseSlow { 0%{box-shadow:0 0 0 0 rgba(192,57,43,0.15);} 70%{box-shadow:0 0 0 10px rgba(192,57,43,0);} 100%{box-shadow:0 0 0 0 rgba(192,57,43,0);} }
.animate-float { animation: float 6s ease-in-out infinite; }
.animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
.animate-pulse-slow { animation: pulseSlow 3s ease-out infinite; }
.card-init { opacity:0; transform:translateY(18px) scale(0.98) rotateX(2deg); filter:blur(3px); }
.card-visible { opacity:1; transform:translateY(0) scale(1) rotateX(0); filter:blur(0); transition:all 700ms cubic-bezier(0.22,1,0.36,1); }
.will-change-transform { will-change:transform; }
.avatar-img { object-fit:cover; object-position:center; display:block; }
  `,
};

// ─── COURSE DETAIL (HOME) ─────────────────────────────────────────────────────
export const courseDetailStylesH = {
  pageContainer: "min-h-screen bg-gradient-to-br from-red-50 via-white to-amber-50 py-8 px-4 relative overflow-x-hidden",
  mainContainer: "max-w-7xl mx-auto space-y-8 relative z-10 transition-all duration-1000",
  backButton: "inline-flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-red-100 animate-slideInLeft",
  backButtonIcon: "w-5 h-5",
  backButtonText: "font-medium",
  headerContainer: "text-center space-y-6 relative",
  courseBadge: "inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/60 backdrop-blur-sm shadow-lg border border-red-100 animate-bounceIn",
  badgeIcon: "w-5 h-5",
  badgeText: "text-sm font-medium bg-gradient-to-r from-red-700 to-amber-600 bg-clip-text text-transparent",
  courseTitle: "text-3xl sm:text-4xl md:text-6xl font-[Montserrat] font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-amber-600 leading-tight animate-fadeInUp",
  overviewContainer: "max-w-4xl mx-auto",
  overviewCard: "p-6 font-serif rounded-3xl bg-white/60 backdrop-blur-md shadow-xl border border-red-100 hover:border-red-200 transition-all duration-500 animate-slideInUp",
  overviewHeader: "flex items-center gap-3 mb-3",
  overviewIcon: "w-5 h-5 text-red-600",
  overviewTitle: "text-lg font-semibold text-gray-800",
  overviewText: "text-gray-700 text-base leading-relaxed text-left",
  statsContainer: "flex items-center justify-center gap-8 flex-wrap animate-fadeInUp",
  statItem: "flex items-center gap-3 text-gray-700 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-red-100",
  statIcon: "w-5 h-5 text-red-600",
  statText: "font-medium",
  teacherStat: "flex items-center gap-3 text-gray-700 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-red-100 transition-all duration-1000",
  teacherIcon: "w-5 h-5 text-red-600",
  teacherText: "font-medium font-[pacifico]",
  mainGrid: "grid font-[pacifico] grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8",
  videoSection: "md:col-span-1 xl:col-span-2 space-y-6",
  videoContainer: "rounded-3xl bg-white/80 backdrop-blur-md shadow-2xl overflow-hidden border border-red-100 hover:border-red-200 transition-all duration-500 animate-slideInRight",
  videoWrapper: "w-full bg-black relative",
  videoFrame: "w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[500px] rounded-t-3xl",
  videoPlaceholder: "w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[500px] flex items-center justify-center bg-gradient-to-br from-red-900 to-red-800 text-white relative overflow-hidden rounded-t-3xl",
  videoPlaceholderPattern: "absolute inset-0 opacity-20",
  videoPlaceholderBlob: "absolute w-32 h-32 rounded-full mix-blend-overlay filter blur-xl",
  videoPlaceholderContent: "text-center relative z-10 px-4",
  videoPlaceholderIcon: "w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm",
  videoPlaceholderPlayIcon: "w-8 h-8 opacity-70",
  videoPlaceholderText: "text-xl mb-2",
  videoPlaceholderSubtext: "text-lg text-red-200",
  videoInfo: "p-6",
  videoTitle: "text-2xl font-bold text-gray-800 mb-3",
  videoDescription: "text-gray-600 leading-relaxed",
  videoMeta: "flex items-center gap-3 mt-4",
  durationBadge: "flex items-center gap-2 text-gray-500 bg-gray-100/50 px-3 py-1 rounded-full",
  durationIcon: "w-4 h-4",
  chapterBadge: "text-sm bg-red-50 text-red-700 px-3 py-1 rounded-full border border-red-200",
  completionSection: "mt-6 pt-6 border-t border-gray-200/50",
  completionButton: "inline-flex cursor-pointer items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm hover:scale-105",
  completionButtonCompleted: "bg-green-500/20 text-green-700 hover:bg-green-500/30 border border-green-300/50",
  completionButtonIncomplete: "bg-red-500/20 text-red-700 hover:bg-red-500/30 border border-red-300/50",
  completionIcon: "w-5 h-5",
  completionText: "text-sm text-gray-500 mt-2",
  sidebar: "space-y-6",
  sidebarCard: "p-6 rounded-3xl bg-white/80 backdrop-blur-md shadow-2xl border border-red-100 hover:border-red-200 transition-all duration-500",
  contentHeader: "flex items-center justify-between mb-6",
  contentTitle: "text-xl font-bold text-gray-800",
  freeAccessBadge: "text-sm text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full flex items-center gap-2",
  freeAccessIcon: "w-4 h-4",
  contentList: "space-y-3 max-h-[320px] sm:max-h-[420px] md:max-h-[600px] overflow-y-auto custom-scrollbar",
  lectureItem: "rounded-2xl bg-white/60 backdrop-blur-sm shadow-lg border border-red-100 hover:border-red-200 transition-all duration-300 animate-fadeInUp",
  lectureHeader: "p-4 cursor-pointer transition-all duration-300",
  lectureHeaderExpanded: "bg-gradient-to-r from-red-50/50 to-amber-50/50 border-b border-red-100",
  lectureHeaderNormal: "hover:bg-white/70",
  lectureContent: "flex items-center justify-between",
  lectureLeft: "flex items-center gap-3",
  lectureChevron: "transform transition-transform duration-300",
  lectureChevronExpanded: "rotate-180 text-red-600",
  lectureChevronNormal: "text-gray-500",
  lectureInfo: "",
  lectureTitle: "font-semibold text-gray-800",
  lectureMeta: "text-sm text-gray-500 flex items-center gap-3 mt-1",
  lectureDuration: "flex items-center gap-1",
  lectureDurationIcon: "w-4 h-4",
  lectureChaptersCount: "text-xs bg-gray-100/50 px-2 py-1 rounded-full border border-gray-200/50",
  chaptersList: "p-4 pt-0 space-y-2 animate-fadeIn",
  chapterItem: "p-3 rounded-xl cursor-pointer transition-all duration-300 group",
  chapterItemSelected: "bg-gradient-to-r from-red-100/50 to-amber-100/50 border-2 border-red-200/50 shadow-md",
  chapterItemNormal: "bg-white/30 hover:bg-white/50 border border-transparent hover:border-red-100",
  chapterContent: "flex items-center justify-between",
  chapterLeft: "flex items-center gap-3 flex-1",
  chapterCompletionButton: "flex-shrink-0 transition-all duration-300 hover:scale-110",
  chapterCompletionCompleted: "text-green-500",
  chapterCompletionNormal: "text-gray-400 group-hover:text-gray-600",
  chapterInfo: "flex-1",
  chapterName: "font-medium transition-colors duration-300",
  chapterNameSelected: "text-red-700",
  chapterNameNormal: "text-gray-800",
  chapterTopic: "text-sm text-gray-500",
  chapterDuration: "text-sm text-gray-500 bg-white/50 px-2 py-1 rounded-full border border-white/50",
  pricingHeader: "flex items-center gap-2 mb-4",
  pricingTitle: "font-bold text-lg text-gray-800",
  pricingAmount: "flex items-baseline gap-3 mb-2",
  pricingCurrent: "text-3xl font-bold bg-gradient-to-r from-red-700 to-amber-600 bg-clip-text text-transparent",
  pricingOriginal: "text-sm text-gray-500 line-through",
  pricingDiscount: "ml-auto text-sm bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full border border-green-200/50",
  pricingDescription: "text-sm text-gray-600 mb-6",
  enrollButton: "w-full inline-flex cursor-pointer items-center justify-center gap-3 px-6 py-4 rounded-full bg-gradient-to-r from-red-600 to-amber-500 text-white font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed",
  enrollButtonFree: "w-full inline-flex items-center justify-center gap-3 px-6 py-2 sm:py-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-sm cursor-default group",
  enrollButtonEnrolled: "w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-white border border-green-300 text-green-700 font-semibold shadow-sm cursor-default group",
  enrollButtonIcon: "w-5 h-5 transition-transform",
  enrollSpinner: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin",
  progressHeader: "flex items-center gap-2 mb-4",
  progressIcon: "w-5 h-5 text-red-600",
  progressTitle: "font-semibold text-gray-800",
  progressSection: "space-y-4",
  progressBarContainer: "w-full bg-gray-200/50 rounded-full h-3 backdrop-blur-sm",
  progressBar: "bg-gradient-to-r from-red-600 to-amber-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-inner",
  progressStats: "grid grid-cols-2 gap-4 text-center",
  progressStat: "p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-red-100 hover:bg-white/80 transition-all duration-300",
  progressStatValue: "text-2xl font-bold bg-gradient-to-r from-red-700 to-amber-600 bg-clip-text text-transparent",
  progressStatLabel: "text-sm text-gray-600 mt-1",
  notFoundContainer: "min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-red-50 via-white to-amber-50 relative overflow-hidden",
  notFoundPattern: "absolute inset-0 opacity-10",
  notFoundBlob: "absolute w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-blob",
  notFoundContent: "text-center relative z-10",
  notFoundTitle: "text-2xl font-bold",
  notFoundText: "mt-2 text-gray-500",
  notFoundButton: "mt-4 cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg bg-white/10 backdrop-blur-md",
};

export const toastStyles = {
  toast: "fixed top-6 right-6 p-4 rounded-2xl shadow-2xl backdrop-blur-md transform transition-all duration-500 z-50 animate-slideInRight",
  toastError: "bg-red-600/90 text-white",
  toastInfo: "bg-red-500/90 text-white",
  toastContent: "flex items-center gap-3",
  toastClose: "hover:scale-110 transition-transform",
  toastCloseIcon: "w-4 h-4",
};

export const animationDelaysH = {
  delay200: "animation-delay-200",
  delay300: "animation-delay-300",
  delay400: "animation-delay-400",
  delay1000: "animation-delay-1000",
  delay2000: "animation-delay-2000",
  delay4000: "animation-delay-4000",
};

export const courseDetailCustomStyles = `
@keyframes fadeIn { from{opacity:0;transform:translateY(-10px);} to{opacity:1;transform:translateY(0);} }
@keyframes slideInUp { from{opacity:0;transform:translateY(30px);} to{opacity:1;transform:translateY(0);} }
@keyframes slideInLeft { from{opacity:0;transform:translateX(-30px);} to{opacity:1;transform:translateX(0);} }
@keyframes slideInRight { from{opacity:0;transform:translateX(30px);} to{opacity:1;transform:translateX(0);} }
@keyframes fadeInUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
@keyframes blob { 0%{transform:translate(0px,0px) scale(1);} 33%{transform:translate(30px,-50px) scale(1.1);} 66%{transform:translate(-20px,20px) scale(0.9);} 100%{transform:translate(0px,0px) scale(1);} }
@keyframes bounceIn { 0%{transform:scale(0.3);opacity:0;} 50%{transform:scale(1.05);} 70%{transform:scale(0.9);} 100%{transform:scale(1);opacity:1;} }
.animate-fadeIn { animation: fadeIn 0.5s ease-out; }
.animate-slideInUp { animation: slideInUp 0.8s ease-out; }
.animate-slideInLeft { animation: slideInLeft 0.8s ease-out; }
.animate-slideInRight { animation: slideInRight 0.8s ease-out; }
.animate-fadeInUp { animation: fadeInUp 0.8s ease-out; }
.animate-blob { animation: blob 7s infinite; }
.animate-bounceIn { animation: bounceIn 0.8s ease-out; }
.animation-delay-200 { animation-delay:0.2s; }
.animation-delay-300 { animation-delay:0.3s; }
.animation-delay-400 { animation-delay:0.4s; }
.animation-delay-1000 { animation-delay:1s; }
.animation-delay-2000 { animation-delay:2s; }
.animation-delay-4000 { animation-delay:4s; }
.custom-scrollbar::-webkit-scrollbar { width:6px; }
.custom-scrollbar::-webkit-scrollbar-track { background:rgba(255,255,255,0.3); border-radius:10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background:rgba(192,57,43,0.4); border-radius:10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background:rgba(192,57,43,0.6); }
`;

export const courseDetailStyles = courseDetailStylesH;

// ─── CERTIFICATE ──────────────────────────────────────────────────────────────
export const certificateStyles = {
  overlay: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
  container: "bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden",
  cert: "relative p-8 bg-gradient-to-br from-red-50 via-white to-amber-50 text-center min-h-[600px]",
  certBorder: "absolute inset-3 border-2 border-red-200 rounded-2xl pointer-events-none",
  certLogo: "mx-auto text-red-600 mb-2",
  certOrg: "text-xs font-semibold uppercase tracking-widest text-red-400 mb-4",
  certTitle: "text-4xl font-extrabold text-gray-900 font-serif mb-1",
  certSubtitle: "text-gray-500 text-sm mb-4",
  certRecipientLabel: "text-xs uppercase tracking-widest text-gray-400 mb-1",
  certRecipientName: "text-3xl font-bold text-red-700 font-serif mb-3",
  certCourseLabel: "text-gray-500 text-sm mb-1",
  certCourseName: "text-xl font-semibold text-gray-800 mb-6",
  certMeta: "flex justify-center gap-12 mb-4",
  certMetaItem: "flex flex-col items-center text-sm text-gray-500",
  certMetaValue: "font-bold text-gray-800 text-base mt-0.5",
  certId: "text-xs text-gray-400 mt-2",
  actions: "flex items-center justify-end gap-3 px-8 py-4 bg-gray-50 border-t border-gray-100",
  closeBtn: "px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 transition",
  printBtn: "flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white text-sm font-semibold hover:opacity-90 transition",
};

// ─── QUIZ ─────────────────────────────────────────────────────────────────────
export const quizStyles = {
  section: "mt-6 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-red-100 overflow-hidden",
  header: "flex items-center justify-between p-6 border-b border-red-100",
  headerLeft: "flex items-center gap-3",
  headerIcon: "w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center",
  headerTitle: "font-bold text-gray-800 text-base",
  headerSubtitle: "text-xs text-gray-500 mt-0.5",
  retakeBtn: "px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition",
  takeQuizBtn: "px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-600 to-amber-500 text-white hover:opacity-90 transition disabled:opacity-50",
  resultBanner: (passed) => `flex items-center gap-3 mx-6 mt-4 px-4 py-3 rounded-xl text-sm ${passed ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`,
  resultBannerIcon: (passed) => passed ? 'text-green-500' : 'text-amber-500',
  resultBannerText: (passed) => `font-semibold ${passed ? 'text-green-700' : 'text-amber-700'}`,
  resultBannerSub: "ml-auto text-xs text-gray-400",
  body: "p-6 space-y-6",
  questionCard: "bg-white/70 rounded-2xl p-5 border border-red-100 shadow-sm",
  questionNumber: "text-xs font-semibold text-red-600 uppercase tracking-wide mb-1",
  questionText: "font-semibold text-gray-800 mb-4 text-base",
  optionsList: "space-y-2",
  optionBtn: (selected) => `w-full text-left px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200 ${selected ? 'bg-red-50 border-red-400 text-red-700' : 'bg-white border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50/50'}`,
  submitBtn: "w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed",
  scoreCard: "text-center py-6 space-y-4",
  scoreCircle: (passed) => `w-28 h-28 mx-auto rounded-full flex flex-col items-center justify-center shadow-lg ${passed ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-amber-400 to-orange-500'}`,
  scoreValue: () => "text-3xl font-extrabold text-white",
  scoreLabel: "text-xs text-white/80 mt-0.5",
  scoreStatus: (passed) => `text-lg font-bold ${passed ? 'text-green-600' : 'text-amber-600'}`,
  scoreMessage: "text-sm text-gray-500 max-w-xs mx-auto",
  viewCertBtn: "inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-semibold hover:opacity-90 transition shadow-md",
};
