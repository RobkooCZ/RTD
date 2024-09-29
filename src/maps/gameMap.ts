class gameMap {
    public map: number[][]; // 2D array to store the map
    public enemyPath: { x: number; y: number }[]; // Array to store the path the enemies will take
    public name: string;

    constructor(map: number[][], enemyPath: { x: number; y: number }[], name: string) {
        this.map = map;
        this.enemyPath = enemyPath;
        this.name = name;
    }
}