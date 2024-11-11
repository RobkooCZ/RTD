interface enemyWave {
    waveNumber: number,
    enemyCount: number,
    timeBetweenEnemies: number,
    waveSent: boolean
}

const enemyWaves: enemyWave[] = [
    {waveNumber: 1, enemyCount: 10, timeBetweenEnemies: 2, waveSent: false},
    {waveNumber: 2, enemyCount: 20, timeBetweenEnemies: 2, waveSent: false},
    {waveNumber: 3, enemyCount: 25, timeBetweenEnemies: 1, waveSent: false},
    {waveNumber: 4, enemyCount: 30, timeBetweenEnemies: 0.5, waveSent: false},
    {waveNumber: 5, enemyCount: 60, timeBetweenEnemies: 1, waveSent: false},
    {waveNumber: 6, enemyCount: 20, timeBetweenEnemies: 0.25, waveSent: false},
    {waveNumber: 7, enemyCount: 100, timeBetweenEnemies: 0.75, waveSent: false},
    {waveNumber: 8, enemyCount: 80, timeBetweenEnemies: 0.75, waveSent: false},
    {waveNumber: 9, enemyCount: 100, timeBetweenEnemies: 0.5, waveSent: false},
    {waveNumber: 10, enemyCount: 100, timeBetweenEnemies: 0.25, waveSent: false},
]