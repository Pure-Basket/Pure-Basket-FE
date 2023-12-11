import React, { useEffect, useState } from 'react';
import {
  Pagination,
  Row,
  Col,
  Carousel,
  theme,
  Divider,
  Typography,
} from 'antd';
import axios from 'axios';
import Product from '../components/Product';
import { defaultInstance } from '../network/axios';

const { Title } = Typography;

const Home = () => {
  const [eventProducts, setEventProducts] = useState({});
  const [products, setProducts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [current, setCurrent] = useState(26);
  const onChange = (page) => {
    setCurrent(page);
    fetchData(page);
  };

  const {
    token: { colorBgContainer, colorPrimary, colorTertiary },
  } = theme.useToken();

  const fetchData = async (page = 1) => {
    const {
      data: { eventProducts, products },
    } = await defaultInstance.get(`/products?page=${page}`);
    setEventProducts(eventProducts);
    setProducts(products);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Divider orientation="center">
        <Title level={3}> 할인 중인 상품</Title>
      </Divider>

      {/* <Carousel autoplay> */}
      {/* <Flex gap="middle" vertical={false} justify="center"> */}
      <Row gutter={[24, 36]}>
        {isLoading
          ? null
          : eventProducts.content.slice(0, 8).map((p) => {
              return (
                <Col key={p.category + p.name} className="gutter-row" span={6}>
                  <Product product={p}></Product>
                </Col>
              );
            })}
        {/* </Flex> */}
      </Row>
      {/* </Carousel> */}

      <Divider orientation="center">
        <Title level={3}>일반 상품</Title>
      </Divider>

      <Row gutter={[24, 36]}>
        {isLoading
          ? null
          : products.content.map((p) => {
              return (
                <Col key={p.category + p.name} className="gutter-row" span={6}>
                  <Product product={p}></Product>
                </Col>
              );
            })}
      </Row>

      <Pagination
        defaultCurrent={1}
        onChange={onChange}
        showSizeChanger={false}
        total={products.totalElements}
      />
    </>
  );
};

export default Home;
