export default class EventBus {

    /**
     * Registered listener subscriptions
     * @type {ISubscriptions}
     */
    protected subscriptions: ISubscriptions = {};

    /**
     * Adds listener and returns unsubscribe function
     *
     * @param  {string}       event
     * @param  {ListenerType} listener
     * @param  {unknown}      context
     *
     * @return {TUnsubscribe}
     */
    public on(event: string, listener: ListenerType, context?: unknown): TUnsubscribe {
        return this.subscribe(event, listener, false, context);
    }

    /**
     * Adds listener that listens only once
     *
     * @param  {string}       event
     * @param  {ListenerType} listener
     * @param  {unknown}      context
     *
     * @return {void}
     */
    public once(event: string, listener: ListenerType, context?: unknown): void {
        this.subscribe(event, listener, true, context);
    }

    /**
     * Emits the event
     *
     * @param  {string} event
     * @param  {unknown[]} args
     *
     * @return {void}
     */
    public emit(event: string, ...args: unknown[]): void {
        const subscriptions = this.subscriptions;
        const current = subscriptions[event];

        if (current) {
            const next = [];
            for (let i = 0; i < current.length; i++) {
                const subscription = current[i];
                const ran = subscription.ran;
                const once = subscription.once;
                if (!once || (once && !ran)) {
                    subscription.listener.apply(undefined, args);
                    subscription.ran = true;
                }
                if (!once) {
                    next.push(subscription);
                }
            }

            if (next.length !== 0) {
                subscriptions[event] = next;
            } else {
                delete subscriptions[event];
            }
        }
    }

    /**
     * Clears all subscriptions
     *
     * @return {void}
     */
    public clear(event?: string): void {
        const subscriptions = this.subscriptions;

        if (event) {
            if (subscriptions[event]) {
                delete subscriptions[event];
            }
        } else {
            for(const event in subscriptions) {
                subscriptions[event].length = 0;
            }
        }
    }

    /**
     * Creates subscription
     *
     * @param  {String}       event
     * @param  {ListenerType} listener
     * @param  {boolean}      once
     * @param  {unknown}      context
     *
     * @return {TUnsubscribe}
     */
    protected subscribe(
        event: string,
        listener: ListenerType,
        once?: boolean,
        context?: unknown): TUnsubscribe {

        const subscriptions = this.subscriptions;
        const group = subscriptions[event] = subscriptions[event] || [];

        const subscription = {
            listener: context ? listener.bind(context) : listener,
            once: !!once,
            ran: false,
        };

        if (group.indexOf(subscription) === -1) {
            group.push(subscription);
        }

        return function unsubscribe(): void {
            subscription.once = subscription.ran = true;
        }
    }
}

interface ISubscription {
    listener: ListenerType;
    once: boolean;
    ran: boolean;
}

interface ISubscriptions {
    [event: string]: ISubscription[];
}

type TUnsubscribe = () => void;

type ListenerType = (...args: unknown[]) => void;
