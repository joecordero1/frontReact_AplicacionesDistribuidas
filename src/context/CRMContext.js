import React, {useState} from 'react';

const CRMContext = React.createContext([{}, () => {}]);

const CRMProvider = props => {
    //definimos el state
    const [auth, guardarAuth] = useState({
        token: '',
        auth: false
    });

    return (
        <CRMContext.Provider value = {[auth, guardarAuth]}>
            {props.children}
        </CRMContext.Provider>
    )


}

export {CRMContext, CRMProvider};
