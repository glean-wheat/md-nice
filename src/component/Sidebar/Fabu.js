/* eslint-disable react/no-unused-state */
import React, {Component} from "react";
import {observer, inject} from "mobx-react";
import {message, Tooltip, Modal, Button, Form, Input, notification} from "antd";
import axios from "axios";
import {solveHtml, copySafari} from "../../utils/converter";
import {LAYOUT_ID, ENTER_DELAY, LEAVE_DELAY} from "../../utils/constant";
import SvgIcon from "../../icon";
import "./Fabu.css";

@inject("content")
@inject("navbar")
@inject("imageHosting")
@inject("dialog")
@observer
class Fabu extends Component {
  constructor(props) {
    super(props);
    this.html = "";
    this.state = {
      visible: false,
      author: " ",
      articleName: " ",
      loadings: false,
    };
  }

  openNotification = (url) => {
    const key = `open${Date.now()}`;
    const btn = (
      <Button type="primary" size="small" onClick={() => notification.close(key)}>
        知道了
      </Button>
    );
    notification.open({
      message: "发布成功",
      description: "预览地址：" + url,
      btn,
      key,
    });
  };

  // GitHub存储上传
  githubUpload = () => {
    if (this.state.author.length < 1 || this.state.articleName < 1) {
      message.error("请输入作者以及文章名称");
      return;
    }
    const config = {
      repo: "one-question-per-day",
      token: "735140d8f78fb267d7a72a30e665791f634f1acf",
      username: "wugaoliang1116",
    };
    const dateFilename = this.state.author + "-" + new Date().getTime() + "-" + this.state.articleName + "-blog.md";
    const url = `https://api.github.com/repos/${config.username}/${config.repo}/issues?access_token=${config.token}`;

    const data = {
      title: dateFilename,
      body: window.localStorage.content,
    };
    this.setState({
      loadings: true,
    });
    axios
      .post(url, data, {
        header: {
          Authorization: "token" + config.token,
        },
      })
      .then(({data: response}) => {
        if (response.code === "exception") {
          throw response.message;
        }
        console.log("response", response.html_url);
        this.openNotification(response.html_url);
        this.setState({
          loadings: false,
        });
      })
      .catch((error, info) => {
        console.log("error, info", error, info);
        message.error("发布失败请查看控制台");
        this.setState({
          loadings: false,
        });
      });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.githubUpload();
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <div>
        <Modal
          title="作者"
          visible={this.state.visible}
          confirmLoading={this.state.loadings}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form name="basic">
            <Form.Item label="作者" name="author" rules={[{required: true, message: "请输入作者名称"}]}>
              <Input
                onChange={(e) => {
                  this.setState({
                    author: e.target.value,
                  });
                }}
              />
            </Form.Item>

            <Form.Item label="文章名称" name="articleName" rules={[{required: true, message: "请输入文章名称"}]}>
              <Input
                onChange={(e) => {
                  this.setState({
                    articleName: e.target.value,
                  });
                }}
              />
            </Form.Item>
          </Form>
        </Modal>
        <Tooltip placement="left" mouseEnterDelay={ENTER_DELAY} mouseLeaveDelay={LEAVE_DELAY} title="发布">
          <a id="nice-sidebar-Fabu" className="nice-btn-Fabu" onClick={this.showModal}>
            <SvgIcon name="github" className="nice-btn-Fabu-icon" />
          </a>
        </Tooltip>
      </div>
    );
  }
}

export default Fabu;
