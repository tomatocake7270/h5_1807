import React, { Component } from 'react';
import {connect} from 'react-redux';

import {Route,Redirect,Switch,withRouter} from 'react-router-dom';

import { TabBar } from 'antd-mobile';

//引入ant-design-mobile的样式
import 'antd-mobile/dist/antd-mobile.css';

import './sass/page.scss';

import {Home} from './components/Home';
import {List} from './components/List';
import {Goods} from './components/Goods';
import {Cart} from './components/Cart';
import {NotFound} from './components/Page';

import axios from 'axios';


// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faHome,
    faListUl,
    faShoppingCart,
    faAssistiveListeningSystems } from '@fortawesome/free-solid-svg-icons'

library.add(
    faHome,
    faListUl,
    faShoppingCart,
    faAssistiveListeningSystems
)

// 设置axios的基础路径
axios.defaults.baseURL = 'http://39.104.104.171:4004'



class App extends Component {
  constructor(){
    super();
    this.state = {
        tabs:[
            {
                title:'首页',
                path:'/home',
                icon:'home'
            },
            {
                title:'列表',
                path:'/list',
                icon:'list-ul'
            },
            {
                title:'详情',
                path:'/goods',
                icon:'assistive-listening-systems'
            },
            {
                title:'购物车',
                path:'/cart',
                icon:'shopping-cart'
            }
        ],
        currentTab:0
    }
  }

  handlerClick(idx,path){
      this.setState({
          currentTab:idx
      });

      //编程式导航
      //获取history的方式
      // * 通过Route渲染App
      // * 利用withRouter高阶组件实现
      this.props.history.push(path);

  }

  componentWillMount(){
      //获取hash值
      let hash = window.location.hash.slice(1);//#list

      //找出对应索引值
      let currentTab = 0
      this.state.tabs.some((item,idx)=>{
          currentTab = idx;
          return item.path === hash
      });

      this.setState({
          currentTab
      });

      console.log('app props:',this.props)
  }
  render() {

    return (
      <div className="container">
            <div className="content">
                <Switch>
                    <Route path="/home" component={Home} />
                    <Route path="/list" component={List} />
                    <Route path="/goods/:id" component={Goods} />
                    <Route path="/cart" component={Cart} />
                    <Route path="/404" component={NotFound} />
                    <Redirect from="/" to="/home" exact/>
                    <Redirect to="/404"/>
                </Switch>
            </div>
            <TabBar
                tintColor="#f00"
                noRenderContent={true}
                hidden={!this.props.tabbarStatus}
                >
                {
                    this.state.tabs.map((tab,idx)=>{
                        return <TabBar.Item
                            title={tab.title}
                            key={tab.path}
                            icon={<FontAwesomeIcon icon={tab.icon}/>}
                            selectedIcon={<FontAwesomeIcon icon={tab.icon}/>}
                            selected={this.state.currentTab === idx}
                            onPress={this.handlerClick.bind(this,idx,tab.path)}
                            badge={tab.path == '/cart' ? this.props.cartQty : null}
                            >
                            {tab.title}
                            </TabBar.Item>
                    })
                }
                
            </TabBar>
        </div>
    );
  }
}

let mapStateToProps = state=>{
    // 此处必须返回一个对象
    console.log(state);
    return {
        //把state.commonReducer.tabbarStatus映射到props
        tabbarStatus:state.commonReducer.tabbarStatus,
        cartQty:state.cartReducer.goodslist.length
    }
}

App = connect(mapStateToProps)(App);

App = withRouter(App);

export default App;
