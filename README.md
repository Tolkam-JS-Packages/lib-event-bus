# tolkam/lib-event-bus

Simple event bus implementation.

## Usage

````ts
import EventBus from '@tolkam/lib-event-bus';

const eventBus = new EventBus();

const unsubscribe = eventBus.on('myEvent', (value) => {
    console.log('got %s', value);
    unsubscribe();
});

eventBus.emit('myEvent', 'some value');

// not logged since listener got unsubscribed
eventBus.emit('myEvent', 'some other value');
````

## Documentation

The code is rather self-explanatory and API is intended to be as simple as possible. Please, read the sources/Docblock if you have any questions. See [Usage](#usage) for quick start.

## License

Proprietary / Unlicensed 🤷
