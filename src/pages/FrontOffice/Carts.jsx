import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox, Flex } from 'antd';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms';
import { createJwtInstance } from '../../network/axios';
import CartItem from '../../components/CartList/CartItem';
import styled from 'styled-components';
import { List } from 'antd';

const Summary = styled.div`
  position: relative;
  width: 250px;
  height: 300px;
  margin-left: 50px;
  padding: 10px 25px 10px 25px;
  border: 2px solid gainsboro;
  border-radius: 20px;
  background-color: whitesmoke;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const PurchaseButton = styled.button`
  font-size: 20px;
  width: 200px;
  height: 50px;
  border: 1px solid #77bb70;
  border-radius: 10px;
  background-color: #d4ffb3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Carts = () => {
  const navigate = useNavigate();
  const [carts, setCarts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [checkItems, setCheckItems] = useState([]);
  const { token } = useRecoilValue(userState);
  const jwtInstance = createJwtInstance(token);

  const shipping = 100;
  let totalPrice = carts
    ?.filter((cart) => checkItems.includes(cart.id))
    .reduce((sum, cart) => sum + cart.price * cart.amount, 0);

  const checkboxHandle = (event) => {
    const item = event.target.id;
    const isChecked = event.target.checked;
    setCheckItems((prev) => {
      if (isChecked) {
        return [...prev, item];
      } else {
        return prev.filter((el) => el !== item);
      }
    });
  };

  const changeAmounts = (cart, newAmount) => {
    setCarts((prevCarts) => {
      const updatedCarts = [...prevCarts];
      const cartIndex = updatedCarts.findIndex((item) => item.id === cart.id);

      if (cartIndex !== -1) {
        updatedCarts[cartIndex] = {
          ...updatedCarts[cartIndex],
          amount: newAmount,
        };
      }
      return updatedCarts;
    });
  };

  const getCarts = async () => {
    const { data } = await jwtInstance.get(`/carts`);
    setCarts(data);
    setCheckItems(data);
    setIsLoading(false);
  };

  const onDelete = (cartId) => {
    setCarts((prev) => prev.filter((cart) => cart.id !== cartId));
  };

  const purchaseList = carts
    ?.filter((cart) => checkItems.includes(cart.id))
    .map((cart) => ({ productId: cart.id, amount: cart.amount }));

  const handlePurchase = async () => {
    await jwtInstance.post(`purchases`, { purchaseList: purchaseList });
    navigate('/order-complete');
  };

  useEffect(() => {
    getCarts();
  }, []);

  return (
    <div>
      <Flex justify='space-around'>
        <div>
          {isLoading ||
            carts?.map((cart) => (
              <Flex style={{ marginBottom: '8px' }}>
                <Checkbox
                  id={cart.id}
                  onChange={checkboxHandle}
                  style={{ marginRight: '15px' }}
                />
                <CartItem
                  cart={cart}
                  changeAmounts={changeAmounts}
                  onDelete={onDelete}
                />
              </Flex>
            ))}
        </div>
        {isLoading || (
          <Summary>
            <div style={{ textAlign: 'center', fontSize: '20px' }}>
              주문 내역
            </div>
            <Flex justify='space-between'>
              <div>상품 금액</div>
              <div>{totalPrice.toLocaleString('ko-KR')}원</div>
            </Flex>
            <Flex justify='space-between'>
              <div>배송료</div>
              <div>{shipping.toLocaleString('ko-KR')}원</div>
            </Flex>
            <Flex justify='space-between'>
              <div>합계</div>
              <div>{(totalPrice + shipping).toLocaleString('ko-KR')}원</div>
            </Flex>
            <PurchaseButton
              disabled={carts.length === 0}
              onClick={handlePurchase}
            >
              주문하기
            </PurchaseButton>
          </Summary>
        )}
      </Flex>
    </div>
  );
};

export default Carts;