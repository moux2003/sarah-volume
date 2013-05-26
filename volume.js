exports.action = function (data, callback, config) {

    // Verify config
    config = config.modules.volume;
    if (!config.os_version || (config.os_version != '32' && config.os_version != '64')) {
        console.log("Invalid Volume config :" + config.os_version);
        return callback({ 'tts': 'Configuration Volume invalide' });
    } else {
        // Set default values
        config.volumeStep = '10000';
        config.maxVolume = 65535;
        if (config.os_version == '32') {
            config.process = '%CD%/plugins/volume/bin/nircmdc.exe';
        } else {
            config.process = '%CD%/plugins/volume/bin/nircmdc64.exe';
        }
    }

    var exec = require('child_process').exec;
    var command = null;
    var result = 'une erreur est survenue';
    // Find wanted command
    switch (data.soundValue) {
        case 'unmute':
            command = ' mutesysvolume 0';
            result = 'coucou, me revoila !';
            break;
        case 'mute':
            command = ' mutesysvolume 1';
            result = '';
            break;
        case 'up':
            command = ' changesysvolume ' + config.volumeStep;
            result = 'voila, je parle plus fort !';
            break;
        case 'down':
            command = ' changesysvolume -' + config.volumeStep;
            result = 'voila, je parle moins fort.';
            break;
        case 'set':
            // We convert percentage to system value based on max volume
            var percent = (data.percentage >= 0 && data.percentage <= 100) ? data.percentage : null;
            if (percent) {
                var sysValue =  Math.round(parseInt(percent) * config.maxVolume / 100);
                command = ' setsysvolume ' + sysValue;
                result = 'volume réglé.';
            }
            break;
        default :
            break;
    }

    if (command) {
        exec(config.process + command, function (error, stdout, stderr) {
            //console.log(process);
        });
    }
    // End of action
    callback({'tts': result});
}
