import {createContext, useState, useContext} from "react";
import DATA from "../../../data/Data.json"

export const DataContext = createContext();

export const useData = () => {
    return useContext(DataContext);
}

export const DataProvider = ({children}) => {
    const [data, setData] = useState(DATA);

    return (
        <DataContext.Provider value={{data, setData}}>
            {children}
        </DataContext.Provider>
    )
}