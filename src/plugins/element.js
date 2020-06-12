import Vue from 'vue'
import { 
    Form, FormItem, Button, Input, Message, Container, Main, Aside, Header,
    Menu, MenuItem, Submenu, Breadcrumb, BreadcrumbItem, Row, Col, Card,
    Table, TableColumn, Switch, Pagination, Tooltip, Dialog, MessageBox,
    Tag, Tree, Select, Option, Cascader, Alert, Tabs, TabPane, Steps, Step,
    CheckboxGroup, Checkbox, Upload, Timeline, TimelineItem
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
