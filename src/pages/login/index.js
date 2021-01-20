import React, { Component } from 'react'
import  "./login.less"
import logo from './images/logo.png'

import { Form, Input, Button, Icon, message } from 'antd';
import { reqLogin } from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import { Redirect } from 'react-router-dom';


class Login extends Component {

    handLeSubmit = (event)=>{
        //阻止事件的默认行为
        event.preventDefault();

        //对所有表单字段进行校验
        this.props.form.validateFields(async (err, values) => {
            //校验成功
            if (!err) {
              //console.log('提交登录的ajax的请求 ', values);
              const {username,password} = values
              /*

                reqLogin(username,password).then(res=>{
                    console.log('成功了',res.data);
                }).catch(err=>{
                    console.log('失败了',err);
                }) 
              */
              
                /*
                
                 try {
                    const response = await reqLogin(username,password)
                    console.log('请求成功',response.data);
                } catch (error) {
                    console.log('请求失败',error);
                }
                */
            
                
                const result = await reqLogin(username,password)
                console.log('请求成功',result);

                //保存user
                const user = result.data
                memoryUtils.user = user//保存在内存中
                storageUtils.saveUser(user)//保存到local中
                
                if(result.status===0){
                    message.success('登录成功')

                    //跳转到管理界面
                    this.props.history.replace('/')
                }else{
                    message.error(result.msg)
                }
               
            }else{
                console.log('校验失败');
            }
          });

        // //得到form对象
        // const form = this.props.form
        // //获取表单项得输入数据
        // const values = form.getFieldsValue()

        // console.log('handLeSubmit',values);
    }

    /**
     * 对密码进行验证
     * 用户名/密码的的合法性要求
            1). 必须输入
            2). 必须大于等于4位
            3). 必须小于等于12位
            4). 必须是英文、数字或下划线组成
     */
    
    validatorPwd=(rule, value, callback)=>{
        console.log('validatorPwd',rule,value);
       
        if(!value){
            callback('密码必须输入') 
        }else if(value.lengh<4){
            callback('密码必须大于等于4位') 
        }else if(value.lengh>12){
            callback('密码必须小于等于12位') 
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('密码必须是英文、数字或下划线组成') 
        }else{
            callback()//验证通过
        }
        //callback('xxx')//验证失败
    }
   

    render() {
        //如果用户已经登录，自动跳转到管理界面
        const user = memoryUtils.user
        if(user&&user._id){
            return <Redirect to='/'/>
        }

        // 得到更强大功能的form对象
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='login'>
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React项目</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handLeSubmit}  className="login-form">
                        <Form.Item>
                            { /*
                            用户名/密码的的合法性要求
                                1). 必须输入
                                2). 必须大于等于4位
                                3). 必须小于等于12位
                                4). 必须是英文、数字或下划线组成
                            */}
                            {
                            getFieldDecorator('username', {//配置对象：属性名是特定的一些名称
                                //声明式验证：直接使用别人定义好的验证规则进行验证
                                rules: [
                                    { required: true, whitespace:true, message: '请填入用户名' },
                                    { min: 4, message: '用户名最少4位' },
                                    { max: 12, message: '用户名最多12位' },
                                    // /^ 开头 $/结尾 
                                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
                                ],
                                initialValue: 'admin', // 初始值
                            })(
                                <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="用户名"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                        
                            {getFieldDecorator('password', {
                                rules: [
                                    { validator:this.validatorPwd }
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                    />
                            )}
                            
                        </Form.Item>
                        <Form.Item>
                        
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        
                        </Form.Item>
                    </Form>
                </section>
                
            </div>
        )
    }
}

/*
1. 高阶函数
    1). 一类特别的函数
        a. 接受函数类型的参数
        b. 返回值是函数
    2). 常见
        a. 定时器: setTimeout()/setInterval()
        b. Promise: Promise(() => {}) then(value => {}, reason => {})
        c. 数组遍历相关的方法: forEach()/filter()/map()/reduce()/find()/findIndex()
        d. 函数对象的bind()
        e. Form.create()() / getFieldDecorator()()
    3). 高阶函数更新动态, 更加具有扩展性
2. 高阶组件
    1). 本质就是一个函数
    2). 接收一个组件(被包装组件), 返回一个新的组件(包装组件), 包装组件会向被包装组件传入特定属性
    3). 作用: 扩展组件的功能
    4). 高阶组件也是高阶函数: 接收一个组件函数, 返回是一个新的组件函数
 */
/*
包装Form组件生成一个新的组件: Form(Login)
新组件会向Form组件传递一个强大的对象属性: form
 */
const WrapLogin = Form.create()(Login)
export default WrapLogin


/*
async和await
1. 作用?
   简化promise对象的使用: 不用再使用then()来指定成功/失败的回调函数
   以同步编码(没有回调函数了)方式实现异步流程
2. 哪里写await?
    在返回promise的表达式左侧写await: 不想要promise, 想要promise异步执行的成功的value数据
3. 哪里写async?
    await所在函数(最近的)定义的左侧写async
 */