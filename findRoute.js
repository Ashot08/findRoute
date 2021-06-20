const checkHasCityStock = (city, citiesHasStock) => {
    return citiesHasStock.includes(city);
}

// list of cities, which has a store (for testing)
const cities = [1, 2, 3, 4, 5];

//list of distances between cities (for testing)
const distances = [
    // {source: 1, destination: 2, distance: 17},
    // {source: 1, destination: 2, distance: 15},
    // {source: 1, destination: 3, distance: 10},
    // {source: 1, destination: 3, distance: 2},
    // {source: 2, destination: 4, distance: 10},
    // {source: 2, destination: 6, distance: 100},
    // {source: 2, destination: 6, distance: 25},
    // {source: 3, destination: 1, distance: 5},
    // {source: 6, destination: 2, distance: 25},

    // {source: 1, destination: 3, distance: 117},
    // {source: 1, destination: 6, distance: 7},
    // {source: 1, destination: 5, distance: 27},
    // {source: 1, destination: 2, distance: 17},
    // {source: 6, destination: 2, distance: 1},

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
    {source: 2, destination: 5, distance: 13},

    // {source: 1, destination: 6, distance: 11},
    // {source: 1, destination: 3, distance: 9},
    // {source: 1, destination: 2, distance: 7},
    // {source: 2, destination: 3, distance: 10},
    // {source: 2, destination: 4, distance: 15},
    // {source: 3, destination: 4, distance: 11},
    // {source: 3, destination: 6, distance: 2},
    // {source: 3, destination: 2, distance: 10},
    // {source: 6, destination: 5, distance: 9},
    // {source: 4, destination: 5, distance: 6},

]

//function-helper to build graph from distances list
//return graph like: {sourceId : [ [destinationId, distance], [destinationId, distance]  ... ] ...}
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
    }
    return graph;
}


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

    console.log(citiesRoutesData);
}

findRoute(cities, distances, 1);