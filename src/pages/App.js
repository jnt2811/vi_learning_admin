import { Button, Select } from "antd";

function App() {
  return (
    <div>
      <Button type="primary" size="large" block>
        Hello
      </Button>

      <Select placeholder="Chonj di dmm" showSearch>
        <Select.Option>a</Select.Option>
      </Select>
    </div>
  );
}

export default App;
