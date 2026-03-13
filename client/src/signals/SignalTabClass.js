import {SignalState} from "@/signals/SignalClass.js";
import {updateSessionStore} from "@/util/index.js";

export class SignalTabClass extends SignalState {
    constructor(props, func) {

        if (!props.model) throw new Error('SignalTab: model is required')
        if (!props.keyId) throw new Error('SignalTab: keyId is required')
        if (!props.label) throw new Error('SignalTab: label is required')
        if (!props.reference) throw new Error('SignalTab: reference is required')
        let checkModel = props.model.name.split('M')[0].toLowerCase()
        if (!props.keyId.includes(checkModel) || !props.label.includes(checkModel))
            throw new Error('SignalTab: keyId and label must match the model name');
        if (!props?.['childController']?.length || !Array.isArray(props?.['childController']))
            console.warn('SignalTab: childController is empty or is not an array');
        // if (!props?.['childTabController'])
        //     console.warn('SignalTab: childTabController is required');

        let defaultProps = {
            wasReloaded: false,
            activeParentTab: '',
            parentTabsList: [],
            tempParentTabsList: [],
            //list of controllers you need to update by default
            childController: [],
            //controller to update child tabs
            childTabController: null,
            //id where are going to use to manage the tabs
            keyId: '',
            //label to display in the tab
            label: '',
            model: null,

            drawer: {open: false},
            ...props
        }
        super(defaultProps, func);
        this.addDefaultMethods();
    }

    addDefaultMethods() {
        const defaultMethods = {
            openDrawer() {
                this.signal.drawer.open = true
            },
            closeDrawer() {
                this.signal.drawer.open = false
            },
            setParentTabsList: async (row) => {
                if (row === 'grid') {
                    this.signal.activeParentTab = row
                    updateSessionStore(this.signal['reference']['activeTab'], row)
                } else {
                    //we have to decide when to fetch the data
                    // debugger
                    let clientId, clientName,
                        tempParentTabsList = this.signal['tempParentTabsList'],
                        keyId = this.signal['keyId'],
                        label = this.signal['label'],
                        model = this.signal['model'],
                        //we got id either from row as instance of ClientModel or as a string
                        tabId = row instanceof  model ? row.get(keyId).toString() : row,
                        item = tempParentTabsList.length ? tempParentTabsList.find(tab => +tab.value === +tabId) : undefined;

                    if (this.signal['wasReloaded'] && tempParentTabsList.length > 0) {
                        //if app reload get the data from the sessionStore
                        clientId = item?.value
                        clientName = item?.label
                    } else {
                        clientId = typeof item === 'object' ? item?.value : row.get(keyId).toString()
                        clientName = typeof item === 'object' ? item?.label : row.get(label)
                    }

                    let activeIds = this.signal['tempParentTabsList']?.map((item) => item?.value),
                        isNot = !activeIds.includes(clientId);

                    if (isNot) {
                        this.signal.tempParentTabsList = [
                            ...this.signal['tempParentTabsList'],
                            {
                                label: clientName,
                                value: clientId
                            }
                        ]
                    }

                    updateSessionStore(this.signal['reference']['tempTab'], this.signal['tempParentTabsList'])
                    updateSessionStore(this.signal['reference']['activeTab'], clientId)
                    this.signal.activeParentTab = clientId
                    this.signal.wasReloaded = false

                    /** we need to set the active tab for the child component,
                     * to keep track of the state of each tab
                     * */
                    this.signal['childTabController'].setActiveTab(clientId)

                    //passing down the clientId to the child components
                    if (this.signal['childController'].length > 0)
                        this.signal['childController'].forEach((child) => child.clientId = clientId)
                }
            },

            closeTab: (id) => {
                //first check if the tab you are trying to close is the active one
                if (this.signal['activeParentTab'] === id) {
                    //and this tab is the only one left
                    //close it and return focus to grid
                    this.signal.activeParentTab = 'grid'
                    updateSessionStore('aT', 'grid')
                }
                let tempTabs = this.signal['tempParentTabsList'],
                    filteredTabs = tempTabs.filter(item => item.value !== id),
                    activeTab = ClientViewController.activeTab,
                    arrActiveIds = filteredTabs.map(item => item.value);
                this.signal.tempParentTabsList = filteredTabs

                /** update tabs in the child component */
                this.signal['childTabController'].activeTab = Object.keys(activeTab)
                    .filter(key => arrActiveIds.includes(key))
                    .reduce((result, key) => {
                        result[key] = activeTab[key];
                        return result;
                    }, {});

                updateSessionStore('tT', this.signal['tempParentTabsList'])
            },

            setActiveTab(endPoint, index, section) {
                let parentTab = this.signal.activeParentTab;
                //update the active tab
                this.signal.data[parentTab][section].activeTab = index.toString()
            },
        };

        for (const key in defaultMethods) {
            if (Object.prototype.hasOwnProperty.call(defaultMethods, key)) {
                this.signal[key] = defaultMethods[key].bind(this.signal);
            }
        }
    }
}