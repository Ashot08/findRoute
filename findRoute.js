const checkHasCityStock = (city, citiesHasStock) => {
    return citiesHasStock.includes(city);
}

// list of cities, which has a store
const cities = [1, 2, 3, 4, 5];

const distances = [
    {source: 1, destination: 2, distance: 15},
    {source: 1, destination: 2, distance: 17},
    {source: 1, destination: 3, distance: 10},
    {source: 1, destination: 3, distance: 2},
    {source: 2, destination: 4, distance: 10},
    {source: 2, destination: 6, distance: 100},
    {source: 2, destination: 6, distance: 25},
]

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
buildGraph(distances);

// {sourceId : [ [destinationId, distance], [destinationId, distance]  ... ] ...}
const distancesGraph = {
    '1': [
        [2, 15],
        [2, 17],
        [3, 10],
        [3, 2],
    ],
    '2': [
        [4, 10],
        [6, 100],
        [6, 25],
    ],
}
const findRoute = (cities, distances, customerCity) => {

}
