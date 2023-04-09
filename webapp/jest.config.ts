const esModules = ['@react-leaflet', 'react-leaflet'].join('|');
export default {
    transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
}