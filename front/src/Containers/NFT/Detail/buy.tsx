import { Input, Modal } from 'antd';
import axios from 'axios';
import { ButtonDiv } from 'component/button/Button';
import { useEffect, useState } from 'react';

import styles from './buy.module.scss';
import { baseURL } from 'apis/baseApi';
import { SaleContract } from 'apis/ContractAddress';

export function BuyDiv(props: {
  nickname: string;
  price: number;
  activated: boolean;
  transactionId: number;
  isOwner: boolean;
  tokenId: string;
  ownerAddress: string;
}) {
  const price = props.price;
  const activated = props.activated;
  const userCheck = props.isOwner;
  const transactionId = props.transactionId;
  const tokenId = parseInt(props.tokenId);
  const ownerAddress = props.ownerAddress;

export function BuyDiv(props: { nickname: string, price: number, activated: boolean, transactionId: number, isOwner: boolean }) {
  const [price, setPrice] = useState(props.price);
  const [activated, setActivated] = useState(props.activated);
  const userCheck = props.isOwner

  const transactionId = props.transactionId

  // 구매 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const cancelModal = () => {
    setIsModalOpen(false);
  };

  // List 모달
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const showListModal = () => {
    setIsListModalOpen(true);
  };
  const cancelListModal = () => {
    setIsListModalOpen(false);
  };
  // List Cancle 모달
  const [isListCancleModalOpen, setIsListCancleModalOpen] = useState(false);
  const showListCancelModal = () => {
    setIsListCancleModalOpen(true);
  };
  const closeCancelListModal = () => {
    setIsListCancleModalOpen(false);
  };

  // 구매 버튼
  async function buyButton() {
    const saleId = await SaleContract.methods.getCurrentSaleOfMARS_NFT(tokenId).call();
    console.log(saleId);

    SaleContract.methods
      .buyNow(saleId, address)
      .send({
        from: address,
        gasPrice: '0',
      })
      .then(() => {
        console.log('샀띠 이제 넌 내꺼띠 ㅋ');
      });

    // axios({
    //   method: 'post',
    //   url: baseURL + `/nft/history/sale/${transactionId}`,
    //   headers: {
    //     Authorization: sessionStorage.getItem('accessToken'),
    //   },
    // }).then((res) => {
    //   console.log(res.data);
    // });
    setIsModalOpen(false);
  }

  // List 취소 버튼
  async function cancleButton() {
    const saleId = await SaleContract.methods.getCurrentSaleOfMARS_NFT(tokenId).call();
    console.log(saleId);

    SaleContract.methods
      .cancelSale(saleId)
      .send({
        from: address,
        gasPrice: '0',
      })
      .then(() => {
        axios({
          method: 'post',
          url: baseURL + `/nft/history/cancel/${transactionId}`,
          headers: {
            Authorization: sessionStorage.getItem('accessToken'),
          },
        }).then((res) => {
          alert('판매가 취소되었습니다.');
        });
      });

    setIsListCancleModalOpen(false);
  }

  // List 버튼
  const [listPrice, setListPrice] = useState('');
  function listData(listPrice: string) {
    // 판매 solidity 등록
    SaleContract.methods
      .createSale(tokenId, ownerAddress, parseInt(listPrice))
      .send({
        from: address,
        gasPrice: '0',
      })
      .then(() => {
        axios({
          method: 'post',
          url: baseURL + `/nft/history/listing`,
          data: {
            transactionId: transactionId,
            price: listPrice,
          },
          headers: {
            Authorization: sessionStorage.getItem('accessToken'),
          },
        }).then((res) => {
          alert('판매가 등록되었습니다.');
        });
      });

    setIsListModalOpen(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.subText}>Current Price</div>
      {price === -1 ? <div className={styles.price}> -</div> :
        <div className={styles.price}>{price.toLocaleString()} O₂</div>
      }
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {/* 구매가 가능한 토큰인지? */}
        {activated && !userCheck ?
          <div onClick={showModal} style={{ width: '48%' }}>
            <ButtonDiv disabled={false} text={'Buy now'} icon={'Buy'} />
          </div>
        ) : (
          <div style={{ width: '48%' }}>
            <ButtonDiv disabled={true} text={'Buy now'} icon={'Buy'} />
          </div>
        )}

        {/* NFT를 만든 사람과 접속한 유저가 같은 사람인지 */}
        {userCheck ? (
          // 내가 민팃한 nft일때
          <>{activated ?
            <div onClick={showListCancelModal} style={{ width: '48%' }}>
              <ButtonDiv disabled={false} text={'Cencel'} color={'white'} icon={'List'} />
            </div> :
            <div onClick={showListModal} style={{ width: '48%' }}>
              <ButtonDiv disabled={false} text={'List'} color={'white'} icon={'List'} />
            </div>
          }
          </>
        ) : (
          // 남이한것일때
          <div style={{ width: '48%' }}>
            <ButtonDiv disabled={true} text={'List'} color={'white'} icon={'List'} />
          </div>
        )}
      </div>
      {/* 구매 모달 */}
      <Modal open={isModalOpen} centered onCancel={cancelModal} footer={null}>
        <div className={styles.modalTitle}>구매하시겠습니까?</div>
        <div onClick={buyButton}>
          <ButtonDiv text={'확인'} />
        </div>
      </Modal>

      {/* List 모달 */}
      <Modal open={isListModalOpen} centered onCancel={cancelListModal} footer={null}>
        <div className={styles.modalTitle}>List Price</div>
        <div className={styles.modalINput}>
          <Input id="listPrice" onChange={(e) => setListPrice(e.target.value)} />
          <div className={styles.modalList} onClick={() => listData(listPrice)}>
            <ButtonDiv text={'확인'} />
          </div>
        </div>
      </Modal>

      {/* 취소 모달 */}
      <Modal open={isListCancleModalOpen} centered onCancel={closeCancelListModal} footer={null}>
        <div className={styles.modalTitle}>판매를 취소 하시겠습니까?</div>
        <div onClick={cancleButton}>
          <ButtonDiv text={'확인'} />
        </div>
      </Modal>
    </div>
  );
}
