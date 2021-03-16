import React, { FC, useEffect, useCallback } from "react";
import { Popover, Empty } from "antd";
import { BellOutlined } from "@ant-design/icons";
import moment from "moment";
import { useModel, useAction } from "@/action";
import { getLang } from "@/locales";
import styles from "./index.less";

import { GlobalType } from "@/types";

export const Message: FC = () => {
  const actions = useAction("global");
  const { messageList } = useModel("global");

  const initData = useCallback(() => actions.getMessage(), [actions]);

  useEffect(() => {
    initData();
  }, [initData]);

  return (
    <Popover
      placement="bottom"
      title={getLang("common.header.message.title")}
      content={<MessageContent list={messageList} />}
      trigger="hover"
    >
      <div className={`${styles.list} ${styles.small}`}>
        <BellOutlined />
      </div>
    </Popover>
  );
};

interface ContentPropsType {
  list: GlobalType.MessageData[];
}

const MessageContent: FC<ContentPropsType> = props => {
  const { list } = props;

  const goToLink = (value: string | undefined) => {
    if (!value) return;
    window.open(value, "newwindow");
  };

  return (
    <div className={styles.message}>
      {list.length ? (
        <>
          {list.map(item => (
            <div className={styles.list} onClick={() => goToLink(item.link)} key={item.time}>
              <div className={styles.header}>
                <h3>{item.title}</h3>
                <span>{moment(item.time).format("YYYY-MM-DD")}</span>
              </div>

              <p>{item.introduce}</p>
            </div>
          ))}
        </>
      ) : (
        <div className={styles.empty}>
          <Empty />
        </div>
      )}
    </div>
  );
};
