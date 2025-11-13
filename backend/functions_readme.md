## getList
// Use this function to get data from Parse Server
// pass a query as an argument i.e for Spots let query = new Parse.Query('Spot');


write your code within the component like this
```javascript
useEffect(() => {
    const loadSpots = async () => {
        const spotQuery = new Parse.Query('Spot');
        try {
            const spotsData = await getList(spotQuery);
            setSpots(spotsData);
        } catch (error) {
            consfole.error('Error fetching s pots:', error);
        }
    };

    loadSpots();
}, []);
```

will render the full list of spots in JSON
```json 
[
    {
        "spotName": "Amager Strand",
        "latitude": 55.67,
        "longitude": 12.636,
        "mainText": "Popular, large city beach, good for intermediate windsurfers and kiters.",
        "windfinderLink": "https://www.windfinder.com/forecast/amager_strandpark",
        "currentWindKnts": 15,
        "currentWindDirection": "E",
        "createdAt": "2025-11-03T17:05:19.505Z",
        "updatedAt": "2025-11-03T17:05:19.505Z",
        "objectId": "EwtiFbsM0B"
    },
    {
        "spotName": "Dragør",
        "latitude": 55.59,
        "longitude": 12.678,
        "mainText": "Picturesque harbor town, good flat water conditions.",
        "windfinderLink": "https://www.windfinder.com/forecast/dragor_havn_capital_region_denmark",
        "currentWindKnts": 20,
        "currentWindDirection": "N",
        "createdAt": "2025-11-03T17:05:19.505Z",
        "updatedAt": "2025-11-03T17:05:19.505Z",
        "objectId": "z87qfaRB3H"
    }.....
]
```

you can then access your spots like 
```javascript
spots.map((spot, index) => ( spot.spotName)
```    