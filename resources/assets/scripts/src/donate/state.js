import { Dispatcher } from 'flux'
import { EventEmitter } from 'fbemitter'

export var DonatePageDispatcher = new Dispatcher();
export var DonatePageStore = {
    state: Object.assign({
        "reward": "none",
        "contact": {}
    }, window.defaultState),
    eventHandler: (e) => {
        switch(e.action) {
            case "amount-changed":
                DonatePageStore.state.amount = e.amount;
                break;
            case "frequency-changed":
                DonatePageStore.state.frequency = e.frequency;
                break;
            case "reward-changed":
                DonatePageStore.state.reward = e.reward;
                break;
            case "contact-changed":
                DonatePageStore.state.contact = e.contact;
                break;
        }
        DonatePageStore.onChange.emit('change');
    },
    onChange: new EventEmitter()
}
DonatePageDispatcher.register(DonatePageStore.eventHandler);
