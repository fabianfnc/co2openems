import { Environment } from "src/environments";

export const environment: Environment = {
    title: "OpenEMS UI",
    shortName: "OpenEMS",

    backend: 'OpenEMS Backend',
    url: "ws://" + location.hostname + ":8082",

    production: true,
    debugMode: false,
};
