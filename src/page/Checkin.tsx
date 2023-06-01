import { Modal, Form, Input, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { getCheckin, patchCheckinById } from "../api/checkin";

interface Session {
  id: number;
  name: string;
  place: string;
  joinLimit: number;
  isParking: boolean;
  isShuttle: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Signup {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  joinNumber: number;
  isParking: boolean;
  isShuttle: boolean;
  isVerified: boolean;
  session: Session;
}

const { Text, Title } = Typography;

const Checkin: React.FC = () => {
  const [showCheckinModal, setShowCheckinModal] = useState<boolean>(false);
  const [showDoubleCheckModal, setShowDoubleCheckModal] =
    useState<boolean>(false);
  const [signup, setSignup] = useState<Signup>();

  useEffect(() => {
    setShowCheckinModal(true);
  }, []);

  const onFormSubmit = (values: any) => {
    getCheckin(values.id)
      .then((res) => {
        if (res.data.status === "success") {
          if (res.data.data.isVerified) {
            setSignup(res.data.data);
            setShowDoubleCheckModal(true);
          } else {
            Modal.error({
              title: "報到失敗",
              content: "此員編尚未完成信件驗證",
              okText: "確認",
            });
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onDoubleCheckOK = () => {
    if (signup) {
      patchCheckinById(signup.id)
        .then((res) => {
          console.log(res);
          Modal.success({
            title: "報到完成",
            content: "恭喜你！已經報到完成！",
            okText: "確認",
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <>
      <Modal open={showCheckinModal} title="報到表單">
        <Form onFinish={onFormSubmit}>
          <Form.Item name="id" label="員編：">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={showDoubleCheckModal}
        title="工作人員確認，請將此頁面交由工作人員確認"
        okText="確認"
        cancelText="取消"
        onOk={onDoubleCheckOK}
      >
        {signup && (
          <>
            <Title>參加場次：{signup.session.name}</Title>
            <Text>員編：{signup.id}</Text>
            <Text>姓名：{signup.name}</Text>
            <Text>電話號碼：{signup.phoneNumber}</Text>
            <Text>Email：{signup.email}</Text>
            <Text>參加人數：{signup.joinNumber}</Text>
            <Text>是否停車：{signup.isParking}</Text>
            <Text>是否接駁：{signup.isShuttle}</Text>
          </>
        )}
      </Modal>
    </>
  );
};

export default Checkin;
