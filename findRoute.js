// list of cities, which has a store (for testing)
const cities = [7, 6, 2, 4];

//list of distances between cities (for testing)
const distances = [
    {source: 1, destination: 2, distance: 10},
    {source: 1, destination: 4, distance: 8},
    {source: 1, destination: 3, distance: 6},
    {source: 2, destination: 4, distance: 5},
    {source: 2, destination: 7, distance: 11},
    {source: 3, destination: 5, distance: 3},
    {source: 4, destination: 3, distance: 2},
    {source: 4, destination: 7, distance: 12},
    {source: 4, destination: 6, distance: 7},
    {source: 4, destination: 5, distance: 5},
    {source: 5, destination: 6, distance: 9},
    {source: 5, destination: 9, distance: 12},
    {source: 6, destination: 8, distance: 8},
    {source: 6, destination: 9, distance: 10},
    {source: 7, destination: 6, distance: 4},
    {source: 7, destination: 8, distance: 6},
    {source: 7, destination: 9, distance: 16},
    {source: 8, destination: 9, distance: 15},
    {source: 9, destination: 5, distance: 43},
    {source: 10, destination: 16, distance: 8},
    {source: 10, destination: 11, distance: 5},
    {source: 12, destination: 11, distance: 4},
    {source: 11, destination: 10, distance: 12},
    {source: 13, destination: 14, distance: 8},
    {source: 12, destination: 13, distance: 100},
    {source: 11, destination: 13, distance: 34},
    {source: 17, destination: 18, distance: 6},
    {source: 16, destination: 17, distance: 160},
    {source: 8, destination: 10, distance: 15},
]

//buildGraph: function-helper to build graph from distances list
//return graph looks like:
// {
//  sourceId : [ [destinationId, distance], [destinationId, distance]  ... ] ...
//  sourceId : [ [destinationId, distance], [destinationId, distance]  ... ] ...
//  sourceId : [ [destinationId, distance], [destinationId, distance]  ... ] ...
//  }
const buildGraph = (distances) => {
    let graph = Object.create(null);

    function addEdge(from, to, distance) {
        if (!graph[from]) {
            graph[from] = [];
            graph[from][0] = [to, distance]
        } else {
            graph[from].push([to, distance])
        }
    }

    for (let item of distances) {
        addEdge(item.source, item.destination, item.distance);
        addEdge(item.destination, item.source, item.distance);
    }
    return graph;
}

//findClosestStore: function-helper to find closest store from object, which consists only nodes with stores
const findClosestStore = (nodes) => {
    let weight = Infinity;
    let closestStoreId;
    for (let item in nodes) {
        if (nodes[+item] && nodes[+item].totalWeight < weight) {
            weight = nodes[+item].totalWeight;
            closestStoreId = +item;
        }
    }
    return closestStoreId;
}

//getRouteFromClosestStore: function-helper to get shortest route from store to customer city
const getRouteFromClosestStore = (closestStoreId, customerCityId, citiesRoutesDataObject) => {
    let currentId = closestStoreId;
    let data = [
        //{
        //    from: Id
        //    to: Id
        //    distance: Distance
        //    message: ...
        // }
    ];

    if (currentId === customerCityId) {
        data.push({message: 'Store located in your city!'});
        return data;
    }

    while (currentId !== customerCityId) {
        let nextId = citiesRoutesDataObject[currentId].previousCity;
        let distance = citiesRoutesDataObject[currentId].totalWeight - citiesRoutesDataObject[nextId].totalWeight;
        data.push(
            {
                from: currentId,
                to: nextId,
                distance: distance,
                message: `From ${currentId} to ${nextId}, distance ${distance}`
            }
        )
        currentId = nextId;
    }
    return data;
}

//main function
const findRoute = (citiesWithStore, distances, customerCity) => {
    const graph = buildGraph(distances);
    let currentCity = customerCity;
    let citiesRoutesData = Object.create(null);

    citiesRoutesData[customerCity] = {
        previousCity: 0,
        totalWeight: 0,
        done: false,
    }

    let queue = [currentCity];
    while (queue.length) {
        let subQueue = [];
        for (let direction of graph[currentCity]) {
            let route = citiesRoutesData[direction[0]] || {};
            let weight = direction[1] + citiesRoutesData[currentCity].totalWeight;

            if (route.totalWeight === undefined || route.totalWeight > weight) {
                route.previousCity = currentCity;
                route.totalWeight = weight;
                route.done = false;
                citiesRoutesData[direction[0]] = route;
            }
            if (!citiesRoutesData[direction[0]].done && !queue.includes(direction[0])) {
                subQueue.push({cityId: direction[0], weight: weight});
            }
        }
        queue = queue.concat(subQueue.sort((a, b) => b.weight - a.weight).map(e => e.cityId));
        do {
            currentCity = queue.pop();
        } while (!graph[currentCity])

        citiesRoutesData[currentCity].done = true;
    }

    let nodesWithStore = Object.create(null);
    for (let item of cities) {
        nodesWithStore[item] = citiesRoutesData[item];
    }
    return getRouteFromClosestStore(findClosestStore(nodesWithStore), customerCity, citiesRoutesData);
}




//Example output
const MyRoute = findRoute(cities, distances, 1);

let totalDistance = 0;
let summaryMessage = '';
for (route of MyRoute) {
    totalDistance += +route.distance;
    summaryMessage += ` / ${route.message}`;
}
console.log(summaryMessage + ' / Total Distance: ' + totalDistance);
