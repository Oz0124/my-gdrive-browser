/* jshint node: true */

module.exports = function(environment) {
    var ENV = {
        modulePrefix: 'ember-gdrive-browser',
        environment: environment,
        baseURL: '/',
        locationType: 'auto',
        EmberENV: {
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. 'with-controller': true
            }
        },

        APP: {
            // Here you can pass flags/options to your application instance
            // when it is created
        },
        contentSecurityPolicy: {
            'default-src': "'none'",
            'script-src': "'self' 'unsafe-eval' https://apis.google.com",
            'font-src': "'self'",
            'connect-src': "'self' https://apis.google.com https://docs.google.com/",
            'img-src': "'self' data: http://csi.gstatic.com https://ssl.gstatic.com https://apis.google.com https://lh4.googleusercontent.com/ https://lh5.googleusercontent.com/ https://drive-thirdparty.googleusercontent.com/16/type/application/",
            'style-src': "'self' 'unsafe-inline'",
            'media-src': "'self'",
            'frame-src': "https://accounts.google.com https://content.googleapis.com",
        },
        torii: {
            providers: {
                // Get authorization code
                'google-oauth2': {
                    apiKey: 'your google drive api Client id',
                    scope: "https://www.googleapis.com/auth/drive",
                    redirectUri: 'https://oz-wfb.000webhostapp.com/'
                },
                // Get google token
                'google-oauth2-bearer': {
                    apiKey: 'your google drive api Client id',
                    scope: "https://www.googleapis.com/auth/drive",
                    redirectUri: 'https://oz-wfb.000webhostapp.com/'
                }
            }
        },
        'simple-auth': {
            store: 'simple-auth-session-store:local-storage'
        }
    };

    if (environment === 'development') {
        // ENV.APP.LOG_RESOLVER = true;
        // ENV.APP.LOG_ACTIVE_GENERATION = true;
        // ENV.APP.LOG_TRANSITIONS = true;
        // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        // ENV.APP.LOG_VIEW_LOOKUPS = true;
    }

    if (environment === 'test') {
        // Testem prefers this...
        ENV.baseURL = '/';
        ENV.locationType = 'none';

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = '#ember-testing';
    }

    if (environment === 'production') {

    }

    return ENV;
};
