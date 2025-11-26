const WIND_LINKS = {
  Sydhavn: "https://windy.app/forecast2/spot/599504/Sydhavnen+Denmark",
  sydhavnen: "https://windy.app/forecast2/spot/599504/Sydhavnen+Denmark",

  Dragør: "https://www.windfinder.com/forecast/dragor_capital_region_denmark",
  dragor: "https://www.windfinder.com/forecast/dragor_capital_region_denmark",

  "Amager Strand": "https://www.windfinder.com/forecast/amager_strandpark",
  "amager strandpark": "https://www.windfinder.com/forecast/amager_strandpark",

  Sydvestpinten:
    "https://windy.app/poi/73.5860482/-23.9834332/Sydvestpynten%2C+cape",
};

export default function getWindfinderlink(spotName) {
  const defaultlink = "https://www.windfinder.com/forecasts";
  if (!spotName) return defaultlink;

  const key = spotName;
  return WIND_LINKS[key] || defaultlink;
}
