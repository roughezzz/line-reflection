import React,{useState} from 'react';
import { Select, DatePicker, Space } from 'antd';
import 'antd/dist/antd.css';
import './style.css';

import {useData} from '../../context/DataContextApi/DataContext'


type Props = {
    getSelectedValue: (value:any) => void

}

const BookProductComponent = ({getSelectedValue}:Props) => {
    const {data} = useData();
    const [selectedProduct, setSelectedProduct] = useState<any>('');
    const [fromDate, setFromDate] = useState<any>('');
    const [toDate, setToDate] = useState<any>('');

    

    const onSelectHandle = (value: any) =>{
        setSelectedProduct(data[value]);
        getSelectedValue(data[value]);
    }

    return (
        <div>
            <Select
                showSearch
                style={{ width: "80%" }}
                placeholder="Search Product"
                optionFilterProp="children"
                filterOption={(input, option:any) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                }
                onSelect={onSelectHandle}
            >
                {data.map((item: any, index: number) => <Select.Option value={index}>{item.name}</Select.Option>)}

            </Select>

            <div style={{marginTop: 20}}>
                <span className="Font-bold">From </span>
                <Space direction="vertical">
                    <DatePicker onChange={(date: any, dateString: string) => {
                            setFromDate(dateString);
                            getSelectedValue({
                                ...selectedProduct,
                                fromDate: dateString,
                                toDate: toDate
                            })

                        }} 
                    />
                </Space>
                <span className="Font-bold"> To </span>
                <Space direction="vertical">
                    <DatePicker  onChange={(date: any, dateString: string) => {
                            setToDate(dateString);
                            getSelectedValue({
                                ...selectedProduct,
                                fromDate: fromDate,
                                toDate: dateString
                            })
                        }} 
                    />
                </Space>
            </div>
            {selectedProduct !== '' && <div style={{marginTop: 20}}>
                <p><span className="Font-bold">Rental Period : </span><span>{selectedProduct.minimum_rent_period}</span></p>
                <p><span className="Font-bold">Mileage : </span><span>{selectedProduct.mileage || 0}</span></p>
                <p><span className="Font-bold">Need to be fixed : </span><span>{selectedProduct.needing_repair ? "Yes" : "No"}</span></p>
            </div>}
        </div>
    );
}

export default BookProductComponent;