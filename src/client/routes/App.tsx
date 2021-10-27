import React,{useState} from 'react';
import { Table, TableColumnsType, Input, Button, Modal } from 'antd';
import {useData} from '../context/DataContextApi/DataContext'

import BookProductComponent from '../components/BookProductComponent/BookProductComponent'
import ReturnProductComponent from '../components/ReturnProductComponent/ReturnProductComponent'


import 'antd/dist/antd.css';
import "./App.css";


const columns:TableColumnsType<any> = [
  {
    title: 'SL.',
    dataIndex: 'serial',
    width: 20,
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Code',
    dataIndex: 'code',
  },
  {
    title: 'Availability',
    dataIndex: 'availability',
  },
  {
    title: 'Need to Repair',
    dataIndex: 'need_to_repair',
  },
  {
    title: 'Durability',
    dataIndex: 'durability',
    
  },
  {
    title: 'Mileage',
    dataIndex: 'mileage',
   
  },
];


function onChange(pagination:any, filters:any, sorter:any, extra:any) {
  console.log('params', pagination, filters, sorter, extra);
}
// const onSearch = (value:string) => {
//   console.log(value)
// };

function App() {
  const {data} = useData();
  // console.log("data",data)

  const structuredData:any = data.map((value:any, index:number) => {
    return {
      serial: index + 1,
      name: value.name,
      code: value.code,
      availability: value.availability? "True": "False",
      need_to_repair: value.needing_repair? "True": "False",
      durability: value.durability,
      mileage: value.mileage || "0" 
    }
  });

  const [dataSource, setDataSource] = useState<any>(structuredData);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalContentType, setModalContentType] = useState<'BOOK'|'RETURN' | 'CONFIRMATION'>('BOOK');
  const [selectedProduct, setSelectedProduct] = useState<any>('');
  const [priceText, setPriceText] = useState<string>('');



  const onSearch = (value:string) => {
    const searchedData = structuredData.filter((item:any) => item.name.toUpperCase().includes(value.toUpperCase()) && item);
    
    setDataSource(searchedData);
    // console.log(value) 
  };

  const handleOnOk = () =>{
  
    if(modalContentType === "RETURN"){
      setPriceText(`Your total price is $${selectedProduct.minimum_rent_period * selectedProduct.price}`);
    }
    else if(modalContentType === "BOOK"){
      const fromDate = new Date(selectedProduct.fromDate);
      const toDate = new Date(selectedProduct.toDate);

      const discountByTime = (toDate.getTime() - fromDate.getTime())/ (1000 * 3600 * 24);

      if(discountByTime > selectedProduct.minimum_rent_period){
        setPriceText(`Your estimated price is $${(selectedProduct.minimum_rent_period * selectedProduct.price)- discountByTime}`);
      } else {
        setPriceText(`Your total price is $${selectedProduct.minimum_rent_period * selectedProduct.price}`);
      }
      
    } else if (modalContentType === "CONFIRMATION") {
      setPriceText('');
      setIsModalVisible(false)
    }
    setModalContentType('CONFIRMATION');


  }

  const handleOnCancel = () =>{
    setIsModalVisible(false)
  }
  
  const onClickBook = () => {
    setModalTitle('Book a product');
    setModalContentType('BOOK');
    setIsModalVisible(true);

  }

  const onClickReturn = () => {
    setModalTitle('Return a product');
    setModalContentType('RETURN');
    setIsModalVisible(true);

  }
  
  return (
      <div className="App">
        <div>

          <div className="App-search" >
            <Input.Search placeholder="Search" onSearch={onSearch} enterButton style={{width: 300}} />
          </div>

          <Table 
            bordered={true}
            rowKey={(record) => record.serial}
            columns={columns} 
            dataSource={dataSource} 
            onChange={onChange} 
            pagination={false} 
          />

          <div className="App-bottom-btn" >
            <Button style={{marginRight: 10}} type="primary" onClick={onClickBook}>Book</Button>
            <Button type="ghost" onClick={onClickReturn}>Return</Button>
          </div>
        </div>

        <Modal 
          title={modalTitle} 
          visible={isModalVisible} 
          onOk={handleOnOk} 
          okText="Yes"
          onCancel={handleOnCancel}
          cancelText="No"
        >
          {modalContentType === "BOOK" && <BookProductComponent getSelectedValue={(value:any) => setSelectedProduct(value)}/>}
          {modalContentType === "RETURN" && <ReturnProductComponent getSelectedValue={(value:any) => setSelectedProduct(value)}/>}

          {modalContentType === "CONFIRMATION" && <div>
            <p>{priceText}</p>
            <p>Do you want yo procedure?</p>
          </div>}
        </Modal>
        
        
      </div>
  );
}

export default App;
