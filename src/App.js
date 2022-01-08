import React from "react";
import { get } from "lodash";
import {
  Switch,
  IconButton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Checkbox,
  FormControl,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
} from "@material-ui/core";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {},
      key: Date.now(),
    };
  }

  componentDidMount() {
    window.chrome.storage &&
      window.chrome.storage.sync.get({ config: {} }, ({ config }) => {
        this.setState({
          config,
        });
      });
  }

  handleTopAdd(config) {
    const items = get(config, "items", []);
    items.push({
      enable: true,
      urlMatch: "",
      querys: [
        {
          key: "",
          value: "",
        },
      ],
    });
    this.setState(
      {
        config: {
          ...config,
          items: items,
        },
      },
      () => this._saveData()
    );
  }

  handleTopSwitch(config, e) {
    if (e.target.checked) {
      window.chrome.browserAction &&
        window.chrome.browserAction.setBadgeText({ text: "开启" });
      window.chrome.browserAction &&
        window.chrome.browserAction.setBadgeBackgroundColor({
          color: "#531dab",
        });
    } else {
      window.chrome.browserAction &&
        window.chrome.browserAction.setBadgeText({ text: "关闭" });
      window.chrome.browserAction &&
        window.chrome.browserAction.setBadgeBackgroundColor({
          color: "#595959",
        });
    }

    this.setState(
      {
        config: { ...config, enable: e.target.checked },
      },
      () => this._saveData()
    );
  }

  handleUrlAdd(config, index) {
    const items = get(config, "items", []);
    items[index].querys.push({
      key: "",
      value: "",
    });
    this.setState(
      {
        config: {
          ...config,
          items: items,
        },
      },
      () => this._saveData()
    );
  }

  handleUrlDel(config, index) {
    const isDel = window.confirm("确定删除此项？");

    if (!isDel) {
      return;
    }

    const items = get(config, "items", []);
    delete items[index];
    this.setState(
      {
        config: {
          ...config,
          items: items.filter((i) => !!i),
        },
        key: Date.now(),
      },
      () => this._saveData()
    );
  }

  handleUrlSwitch(config, index, e) {
    const items = get(config, "items", []);
    items[index].enable = e.target.checked ? true : false;
    this.setState(
      {
        config: {
          ...config,
          items: items,
        },
      },
      () => this._saveData()
    );
  }

  handleUrlEdit(config, index, e) {
    const items = get(config, "items", []);
    items[index].urlMatch = e.target.value;
    this.setState(
      {
        config: {
          ...config,
          items: items,
        },
      },
      () => this._saveData()
    );
  }

  handleUrlKeyDel(config, index, _index) {
    const items = get(config, "items", []);
    delete items[index].querys[_index];
    items[index].querys = items[index].querys.filter((i) => !!i);
    this.setState(
      {
        config: {
          ...config,
          items: items,
        },
        key: Date.now(),
      },
      () => this._saveData()
    );
  }

  handleUrlKeyEdit(config, index, _index, e) {
    const items = get(config, "items", []);
    items[index].querys[_index].key = e.target.value;
    this.setState(
      {
        config: {
          ...config,
          items: items,
        },
      },
      () => this._saveData()
    );
  }

  handleUrlValueEdit(config, index, _index, e) {
    const items = get(config, "items", []);
    items[index].querys[_index].value = e.target.value;
    this.setState(
      {
        config: {
          ...config,
          items: items,
        },
      },
      () => this._saveData()
    );
  }

  _saveData() {
    window.chrome.storage &&
      window.chrome.storage.sync.set({ config: this.state.config });
  }

  render() {
    const { config, key } = this.state;

    return (
      <div className="App" key={key}>
        <div className="App-top">
          <div>
            <Switch
              checked={config.enable ? "checked" : ""}
              onChange={(e) => this.handleTopSwitch(config, e)}
              name="checkedB"
              color="primary"
            />
            启用
          </div>
          <div>
            <IconButton color="primary">
              <Tooltip arrow placement="top" title="添加网址项目">
                <AddCircle onClick={() => this.handleTopAdd(config)} />
              </Tooltip>
            </IconButton>
          </div>
        </div>
        <Divider />
        <div className="App-item">
          {get(config, "items", []).map((item, index) => (
            <Accordion expanded square>
              <AccordionSummary
                expandIcon={
                  <>
                    <Tooltip arrow placement="top" title="添加参数">
                      <AddCircle
                        onClick={() => this.handleUrlAdd(config, index)}
                      />
                    </Tooltip>

                    <Tooltip arrow placement="top" title="删除当前网址">
                      <RemoveCircle
                        color="secondary"
                        onClick={() => this.handleUrlDel(config, index)}
                      />
                    </Tooltip>
                  </>
                }
              >
                <Checkbox
                  color="primary"
                  checked={item.enable ? "checked" : ""}
                  onChange={(e) => this.handleUrlSwitch(config, index, e)}
                />
                <TextField
                  size="small"
                  style={{ width: "90%" }}
                  label="URL"
                  defaultValue={item.urlMatch}
                  onChange={(e) => this.handleUrlEdit(config, index, e)}
                />
              </AccordionSummary>
              <AccordionDetails>
                {get(item, "querys", []).length ? (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>参数</TableCell>
                        <TableCell>值</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {get(item, "querys", []).map((_item, _index) => (
                        <TableRow>
                          <TableCell>
                            <TextField
                              size="small"
                              style={{ width: "90%" }}
                              defaultValue={_item.key}
                              onChange={(e) =>
                                this.handleUrlKeyEdit(config, index, _index, e)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <TextField
                                size="small"
                                style={{ width: "80%" }}
                                defaultValue={_item.value}
                                onChange={(e) =>
                                  this.handleUrlValueEdit(
                                    config,
                                    index,
                                    _index,
                                    e
                                  )
                                }
                              />
                              <Tooltip
                                arrow
                                placement="top"
                                title="删除当前网址"
                              >
                                <RemoveCircle
                                  color="secondary"
                                  onClick={() =>
                                    this.handleUrlKeyDel(config, index, _index)
                                  }
                                />
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  ""
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
