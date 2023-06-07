import { Modal, Form, Input, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCheckin, getSessionById, patchCheckinById } from "../api/checkin";

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

interface FormValues {
  id: string;
}

const { useForm } = Form;
const { Text } = Typography;

const Checkin: React.FC = () => {
  const [form] = useForm();
  const { id } = useParams();
  const [showCheckinModal, setShowCheckinModal] = useState<boolean>(false);
  const [showCheckModal, setShowCheckModal] = useState<boolean>(false);
  const [showDoubleCheckModal, setShowDoubleCheckModal] =
    useState<boolean>(false);
  const [session, setSession] = useState<Session>();
  const [signup, setSignup] = useState<Signup>();

  useEffect(() => {
    if (id) {
      getSessionById(id)
        .then((res) => {
          if (res.data.status === "success") {
            setSession(res.data.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
    setShowCheckinModal(true);
  }, [id]);

  const onFormSubmit = (values: FormValues) => {
    getCheckin(values.id)
      .then((res) => {
        console.log(res);

        if (res.data.status === "success") {
          if (!res.data.data.isVerified) {
            Modal.error({
              title: "報到失敗",
              content: "此員編尚未完成信件驗證",
              okText: "確認",
            });
          } else if (res.data.data.isCheckin) {
            Modal.error({
              title: "報到失敗",
              content: "此員編已完成報到",
              okText: "確認",
            });
          } else if (res.data.data.session.id !== session?.id) {
            Modal.error({
              title: "報到失敗",
              content: "場次不符合",
              okText: "確認",
            });
          } else {
            setSignup(res.data.data);
            setShowCheckModal(true);
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
          Modal.success({
            title: "報到完成",
            content: "恭喜你！已經報到完成！",
            okText: "確認",
            onOk: () => {
              setShowDoubleCheckModal(false);
            },
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <>
      {session && (
        <Modal
          open={showCheckinModal}
          title={
            <>
              <p>歡迎參加2023悠活家庭日</p>
              <p>{session.name}</p>
              <p>請輸入您的兆豐銀行員工編號</p>
            </>
          }
          okText="確認"
          cancelText="重置"
          onOk={form.submit}
          onCancel={() => {
            form.resetFields();
          }}
          closeIcon={false}
        >
          <Form form={form} onFinish={onFormSubmit}>
            <Form.Item name="id" label="員編：">
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      )}
      <Modal
        open={showCheckModal}
        title="這是您的個人資訊"
        okText="確認"
        cancelText="返回"
        onOk={() => {
          setShowCheckModal(false);
          setShowDoubleCheckModal(true);
        }}
        onCancel={() => {
          setShowCheckModal(false);
          setShowCheckinModal(true);
        }}
      >
        {signup && (
          <>
            <p>兆豐銀行員工編號：{signup.id}</p>
            <p>姓名：{signup.name}</p>
          </>
        )}
      </Modal>
      <Modal
        open={showDoubleCheckModal}
        title="您本次報名資訊"
        okText="確認報到"
        cancelText="返回"
        onOk={onDoubleCheckOK}
        onCancel={() => {
          setShowDoubleCheckModal(false);
        }}
      >
        {signup && (
          <>
            <p>兆豐銀行員工編號：{signup.id}</p>
            <p>姓名：{signup.name}</p>
            <p>報名場次：{signup.session.name}</p>
            <p>
              參加人數：
              {signup.joinNumber >= 4 ? (
                <Text type="danger">{signup.joinNumber}</Text>
              ) : (
                signup.joinNumber
              )}
            </p>
          </>
        )}
      </Modal>
    </>
  );
};

export default Checkin;
