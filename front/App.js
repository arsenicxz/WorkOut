import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, Component} from 'react';
import { Button, Pressable, StyleSheet, Text, TextInput, TouchableHighlight, View, Image, Alert, Modal, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useFonts } from 'expo-font';
import {WebView} from 'react-native-webview'
//import QRCode from 'react-native-qrcode';
import QRCode from 'react-native-qrcode-svg';
const Stack = createStackNavigator();


function reqReadyStateChange(request) {
  if (request.readyState == 4) {
      var status = request.status;
      if (status == 200) {
          //document.getElementById("output").innerHTML=request.responseText;
          console.log(request.responseText);
      }
  }
}


//var reqRegInf = "mod=" + "registration" + "&login="+ user.login + "&password="+ user.password;

var reqResult;
var idUser;
var isAdmin;
var idPlace;

function idRemember(){
    idUser = reqResult;
}

function req(value) {
  var request = new XMLHttpRequest();
  /* Скачиваем ngrok, регистрируемся, пишем в командной строке ngrok http 8080 -host-header="localhost:8080"
    или ngrok http -host-header="localhost:8080", если первая строчка не помогла, указываем в строке localhost,
    который задается в сервере, далее копируем создавшуюся ссылку сюда в строчку ниже :)
  */
  request.open("POST", "http://b23d085a118f.ngrok.io/");
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  request.onreadystatechange = reqReadyStateChange(request);
  request.responseType = 'text';
  request.send(value);
  request.onload = function () {
    reqResult = request.response;
    console.log(reqResult);
  }
}


function App() {

  let [fontsLoaded] = useFonts({
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
    'Raleway': require('./assets/fonts/Raleway-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return(<View style={styles.contentContainer}>
      <Text style={{fontSize: 18}}>Loading</Text>
      </View>
    );
  } else {
  return(
  <NavigationContainer>
    <Stack.Navigator
    headerMode="none">
      <Stack.Screen
      name="Welcome"
      component={Welcome}
      />
      <Stack.Screen
      name="Login"
      component={LoginPage}
      />
      <Stack.Screen
      name="Reg"
      component={RegistrationPage}
      />
      <Stack.Screen
      name="Main"
      component={MainMenu}
      />
      <Stack.Screen
      name="MainAdmin"
      component={MainMenuAdmin}
      />
      <Stack.Screen
      name="GenQR"
      component={GenerateQR}
      />
      <Stack.Screen
      name="QRres"
      component={QRresult}
      /> 
      <Stack.Screen
      name="QR"
      component={QRScanner}
      />
      <Stack.Screen
      name="AlreadyMax"
      component={AlreadyMax}
      />
      <Stack.Screen
      name="ToLine"
      component={ToLine}
      />
      <Stack.Screen
      name="wantGo"
      component={wantGo}
      />
      <Stack.Screen
      name="Go"
      component={Go}
      />
      <Stack.Screen
      name="ErrorQR"
      component={ErrorQR}
      />
      
    </Stack.Navigator>
  </NavigationContainer>
  )}
}

function Welcome({navigation}) {

  const onPressHandlerLogin = () => {
    navigation.navigate('Login');
  }
  const onPressHandlerReg = () => {
    navigation.navigate('Reg');
  }
 
  return (

    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('./assets/icon2.png')}
                resizeMode={'contain'}
                style={{height: 40, width: 40}} />
        <Text style={styles.textLogo}>воркаут.очередь</Text>
        <Text style={styles.textUnderLogo}>Безопасно и честно</Text>
      </View>
      <View style={styles.contentContainer}>
        <Pressable
        onPress={onPressHandlerLogin}
        style={({pressed}) => [
              {backgroundColor: pressed? '#0038FF' : '#0094FF'},
              styles.btn
            ]}
        >
          <Text style={styles.textButton}>Войти</Text>
        </Pressable>
        <Pressable
        onPress={onPressHandlerReg}
        style={({pressed}) => [
              {backgroundColor: pressed? '#DEDEDE' : '#fff'},
              {borderWidth: 1, borderColor: '#D1D1D1'},
              styles.btn,
            ]}
        >
          <Text style={[styles.textButton, 
                        {color:'black',
                        fontFamily:'Inter-Medium'}]}>Зарегистрироваться</Text>
        </Pressable>
      </View>
    </View>
  );

}


function LoginPage({navigation}) {

  const onPressHandlerLogin = () => {
    if(reqResult!=='error'){
      setUserInfo({...userInfo, loginError:false});
      idRemember();
      var isAdminReq;
      isAdminReq = "mod=" + "isAdmin" + "&userId=" + String(reqResult);
      req(isAdminReq); 
      console.log(reqResult);
      setTimeout(()=> {if(reqResult=='Y'){
        isAdmin = true;
        navigation.replace('MainAdmin')
      }else{
      navigation.replace('Main')}}, 1000);
   }else if(reqResult=='error'){
        setUserInfo({...userInfo, loginError:true});
   }
  }
  const onPressHandlerBack = () => {
    navigation.navigate('Welcome');
  }

  const [userInfo, setUserInfo] = useState({
    email:'',
    emailError: '',
    emailErrorBool:true,
    passwordError:'',
    passwordErrorBool:true,
    password:'',
    formValid:false,
    loginError:null,
  })

  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //const pe = /^.*(?=.{8,})(?=..*[0-9])(?=.*[a-z])(?=.*[A-Z])$/;
  let emailValidator = () => {
      if(userInfo.email==""){
        setUserInfo({...userInfo, emailError:"E-mail не может быть пустым", emailErrorBool:true })
      } else if(!re.test(String(userInfo.email))){
        setUserInfo({...userInfo, emailError:"Введите корректный e-mail", emailErrorBool:true })
      } else{
        setUserInfo({...userInfo, emailError:"" , emailErrorBool:false})
      }
  }

  let passwordValidator = () => {
    if(userInfo.password==""){
      setUserInfo({...userInfo, passwordError:"Пароль не может быть пустым", passwordErrorBool:true })
    } else{
      setUserInfo({...userInfo, passwordError:"", passwordErrorBool:false })
    }
}


useEffect(  ()=>{
  if(userInfo.emailErrorBool==true || userInfo.passwordErrorBool==true){
    setUserInfo({...userInfo, formValid:false})
  } else{
    setUserInfo({...userInfo, formValid:true})
  }
}, [userInfo.emailErrorBool, userInfo.passwordErrorBool])

function LoginTry(){
  var reqLogInf = "mod=" + "authorization" + "&login="+ userInfo.email + "&password="+ userInfo.password;
  req(reqLogInf);
  setTimeout(()=>{onPressHandlerLogin()},1000);
}
 
 
  return (

    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('./assets/icon2.png')}
                resizeMode={'contain'}
                style={{height: 40, width: 40}} />
        <Text style={styles.textLogo}>воркаут.очередь</Text>
        <Text style={styles.textUnderLogo}>Безопасно и честно</Text>
        {userInfo.loginError ? <Text style={{fontFamily:'Inter-Bold', fontSize: 24, marginTop:30, color:'#FF3434'}}>Ошибка</Text> : <Text></Text>}
      </View>
      <View style={styles.contentContainer}>
      <TextInput
        onChangeText={ (value) => {setUserInfo({...userInfo, email: value})} }
        //onEndEditing={emailValidator}
        autoCapitalize='none'
        autoCorrect={false}
        onBlur={emailValidator}
        onSubmitEditing={emailValidator}
        autoCompleteType='email'
        style={styles.input}
        placeholder="e-mail"
        />
        <Text style={{color: 'red'}}>{userInfo.emailError}</Text>
        <TextInput
        onChangeText={(value)=>{setUserInfo({...userInfo, password: value})}}
        //onEndEditing={passwordValidator}
        autoCapitalize='none'
        autoCorrect={false}
        secureTextEntry={true}
        onBlur={passwordValidator}
        onSubmitEditing={passwordValidator}
        autoCompleteType='password'
        style={styles.input}
        placeholder="пароль"
        />
        <Text style={{color: 'red'}}>{userInfo.passwordError}</Text>
        <Pressable
        onPress={LoginTry}
        style={({pressed}) => [
              {backgroundColor: pressed? '#0038FF' : '#0094FF'},
              styles.btn
            ]}
        >
          <Text style={styles.textButton}>Войти</Text>
        </Pressable>
        <Pressable
        onPress={onPressHandlerBack}
        style={({pressed}) => [
              {backgroundColor: pressed? '#DEDEDE' : '#fff'},
              {borderWidth: 1, borderColor: '#D1D1D1'},
              styles.btn,
            ]}
        >
          <Text style={[styles.textButton, 
                        {color:'black',
                        fontFamily:'Inter-Medium'}]}>Назад</Text>
        </Pressable>
      </View>
    </View>
  );

}

function RegistrationPage({navigation}) {

  const onPressHandler = () => {
    navigation.navigate('Welcome');
  }

  
  const [userInfo, setUserInfo] = useState({
      email:'',
      emailError: '',
      emailErrorBool:true,
      passwordError:'',
      passwordErrorBool:true,
      password:'',
      formValid:false,
      textInfo:'',
      isError:null,
    })
   

  //console.log(userInfo)
 
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let emailValidator = () => {
      if(userInfo.email==""){
        setUserInfo({...userInfo, emailError:"E-mail не может быть пустым", emailErrorBool:true })
      } else if(!re.test(String(userInfo.email))){
        setUserInfo({...userInfo, emailError:"Введите корректный e-mail", emailErrorBool:true })
      } else{
        setUserInfo({...userInfo, emailError:"" , emailErrorBool:false})
      }
  }

  let passwordValidator = () => {
    if(userInfo.password==""){
      setUserInfo({...userInfo, passwordError:"Пароль не может быть пустым", passwordErrorBool:true })
    } else{
      setUserInfo({...userInfo, passwordError:"", passwordErrorBool:false })
    }
}


useEffect(  ()=>{
  if(userInfo.emailErrorBool==true || userInfo.passwordErrorBool==true){
    setUserInfo({...userInfo, formValid:false})
  } else{
    setUserInfo({...userInfo, formValid:true})
  }
}, [userInfo.emailErrorBool, userInfo.passwordErrorBool])

function isValidForm(){
  emailValidator();
  passwordValidator();
  if(userInfo.formValid==true){
    signInTry();
  }
}

function signInTry(){
  var reqRegInf = "mod=" + "registration" + "&login="+ userInfo.email + "&password="+ userInfo.password;
  req(reqRegInf);
  setTimeout(()=>{
    if(String(reqResult)=='error'){
      console.log(reqResult)
      setUserInfo({...userInfo, isError:true })
    } else {
      console.log(reqResult)
      setUserInfo({...userInfo, isError:false})
    }
  },1000)
}



  return (

    <View style={styles.container}>


      <View style={styles.logoContainer}>
      <Image source={require('./assets/icon2.png')}
                resizeMode={'contain'}
                style={{height: 40, width: 40}} />
        <Text style={styles.textLogo}>воркаут.очередь</Text>
        <Text style={styles.textUnderLogo}>Безопасно и честно</Text>
        {userInfo.isError ? <Text style={{fontFamily:'Inter-Bold', fontSize: 24, marginTop:30, color:'#FF3434'}}>Ошибка</Text> : <Text></Text>}
        {userInfo.isError == false ? <Text style={{fontFamily:'Inter-Bold', fontSize: 24, marginTop:30, color:'#43E36B'}}>Успешно!</Text> : <Text></Text>}
      </View>
      
      <View style={styles.contentContainer}>
        
        <TextInput
        name='email'
        autoCapitalize='none'
        autoCorrect={false}
        onChangeText={ (value) => {setUserInfo({...userInfo, email: value})} }
        //onEndEditing={emailValidator}
        onBlur={emailValidator}
        onSubmitEditing={emailValidator}
        autoCompleteType='email'
        style={styles.input}
        placeholder="e-mail"
        />
        <Text style={{color: 'red'}}>{userInfo.emailError}</Text>
        <TextInput
        name='password'
        autoCapitalize='none'
        autoCorrect={false}
        //secureTextEntry={true}
        onChangeText={(value)=>{setUserInfo({...userInfo, password: value})}}
        //onEndEditing={passwordValidator}
        onBlur={passwordValidator}
        onSubmitEditing={passwordValidator}
        autoCompleteType='password'
        style={styles.input}
        placeholder="пароль"
        />
        <Text style={{color: 'red'}}>{userInfo.passwordError}</Text>
        <Pressable
        onPress={isValidForm}
        //disabled={!userInfo.formValid}
        style={({pressed}) => [
              {backgroundColor: pressed? '#0038FF' : '#0094FF'},
              styles.btn
            ]}
        >
          <Text style={styles.textButton}>Зарегистрироваться</Text>
        </Pressable>
        <Pressable
        onPress={onPressHandler}
        style={({pressed}) => [
              {backgroundColor: pressed? '#DEDEDE' : '#fff'},
              {borderWidth: 1, borderColor: '#D1D1D1'},
              styles.btn
            ]}
        >
          <Text style={[styles.textButton, 
                        {color:'black',
                        fontFamily:'Inter-Medium'}]}>Назад</Text>
        </Pressable>
      </View>
    </View>
  );

}

function MainMenu({navigation}) {


  const onPressHandlerScan = () => {
    navigation.navigate('QR');
  }
  const onPressHandlerOff = () => {
    navigation.navigate('Welcome');
  }

 
  return (

    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('./assets/icon2.png')}
                resizeMode={'contain'}
                style={{height: 40, width: 40}} />
        <Text style={styles.textLogo}>воркаут.очередь</Text>
        <Text style={styles.textUnderLogo}>Безопасно и честно</Text>
      </View>
      <View style={styles.contentContainer}>
        <Pressable
        onPress={onPressHandlerScan}
        style={({pressed}) => [
              {backgroundColor: pressed? '#0038FF' : '#0094FF'},
              styles.btn
            ]}
        >
          <Text style={styles.textButton}>Отсканировать QR-код</Text>
        </Pressable>
        <Pressable
        onPress={onPressHandlerOff}
        style={({pressed}) => [
              {backgroundColor: pressed? '#B1DEFF' : '#fff'},
              {borderWidth: 1, borderColor: '#D1D1D1'},
              styles.btn,
            ]}
        >
          <Text style={[styles.textButton, 
                        {color:'black',
                        fontFamily:'Inter-Medium'}]}>Выйти</Text>
        </Pressable>
      </View>
    </View>
  );

}

function MainMenuAdmin({navigation}) {

  const onPressHandlerGen = () => {
    navigation.navigate('GenQR');
  }
  const onPressHandlerOff = () => {
    navigation.navigate('Welcome');
  }

 
  return (

    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('./assets/icon2.png')}
                resizeMode={'contain'}
                style={{height: 40, width: 40}} />
        <Text style={styles.textLogo}>воркаут.очередь</Text>
        <Text style={styles.textUnderLogo}>Безопасно и честно</Text>
      </View>
      <View style={styles.contentContainer}>
        <Pressable
        onPress={onPressHandlerGen}
        style={({pressed}) => [
              {backgroundColor: pressed? '#0038FF' : '#0094FF'},
              styles.btn
            ]}
        >
          <Text style={styles.textButton}>Сгенерировать QR-код</Text>
        </Pressable>
        
        <Pressable
        onPress={onPressHandlerOff}
        style={({pressed}) => [
              {backgroundColor: pressed? '#B1DEFF' : '#fff'},
              {borderWidth: 1, borderColor: '#D1D1D1'},
              styles.btn,
            ]}
        >
          <Text style={[styles.textButton, 
                        {color:'black',
                        fontFamily:'Inter-Medium'}]}>Выйти</Text>
        </Pressable>
      </View>
    </View>
  );

}


function QRresult({navigation}) {

  const onPressHandlerBack = () => {
    navigation.navigate('GenQR');
  }

    if(reqResult=='error'){
      return(
        <View style={{flex:1,
                      alignItems:'center',
                      justifyContent:'center',
                      backgroundColor:'#FFA6A6'}}>
              <Text style={{fontSize:24,
                            fontFamily:'Inter-Bold'}}>Ошибка</Text>
              <Pressable
                  onPress={onPressHandlerBack}
                  style={({pressed}) => [
                        {backgroundColor: pressed? '#DF0000' : '#FF3434'},
                        styles.btn,
                      ]}
                  >
                  <Text style={[styles.textButton, 
                                {color:'white',
                        fontFamily:'Inter-Medium'}]}>Назад</Text>
        </Pressable>            
        </View>
      )
    } else {
      return(
      <View style={{flex:1,
        //alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#fff'}}>
          <View style={{flex:1}}></View>
          <View style={{flex:3, alignItems:'center',
        justifyContent:'center'}}>
        <QRCode
        
            size={250}
            value={String(reqResult).length > 0 ? String(reqResult) : "errorQR"}
        />
        </View>
        <View style={{flex:1, alignItems:'center',
        justifyContent:'center'}}>
        <Pressable
        onPress={onPressHandlerBack}
        style={({pressed}) => [
              {backgroundColor: pressed? '#DEDEDE' : '#fff'},
              {borderWidth: 1, borderColor: '#D1D1D1'},
              styles.btn,
            ]}
        >
          <Text style={[styles.textButton, 
                        {color:'black',
                        fontFamily:'Inter-Medium',
                        
                        }]}>Назад</Text>
        </Pressable> 
        </View>         
      </View>
      )}

}

function GenerateQR({navigation}) {


  const onPressHandlerGen = () => {
    navigation.navigate('QRres');
  }
  const onPressHandlerOff = () => {
    navigation.navigate('Welcome');
  }


  const [placeInfo, setPlaceInfo] = useState({
    name:'',
    nameError: '',
    nameErrorBool:true,
    addressError:'',
    addressErrorBool:true,
    address:'',
    capacity:'',
    capacityError:'',
    capacityError:true,
    formValid:false,
  })

  let nameValidator = () => {
    if(placeInfo.name==""){
      setPlaceInfo({...placeInfo, nameError:"Название не может быть пустым", nameErrorBool:true })
    } else{
      setPlaceInfo({...placeInfo, nameError:"", nameErrorBool:false })
    }
}

let addressValidator = () => {
  if(placeInfo.address==""){
    setPlaceInfo({...placeInfo, addressError:"Адрес не может быть пустым", addressErrorBool:true })
  } else{
    setPlaceInfo({...placeInfo, addressError:"", addressErrorBool:false })
  }
}

let capacityValidator = () => {
  if(placeInfo.capacity==""){
    setPlaceInfo({...placeInfo, capacityError:"Вместимость не может быть пустой", capacityErrorBool:true })
  } else{
    setPlaceInfo({...placeInfo, capacityError:"", capacityErrorBool:false })
  }
}

function isValidForm(){
  nameValidator();
  addressValidator();
  capacityValidator();
  if(placeInfo.formValid==true){
    var reqQRplace = "mod=" + "placeGenerating" + "&name="+ placeInfo.name + "&adress="+ placeInfo.address + "&maxCount="+ placeInfo.capacity;
    req(reqQRplace);
    setTimeout(()=>{onPressHandlerGen()}, 500); 
  }
}



useEffect(  ()=>{
if(placeInfo.nameErrorBool==true || placeInfo.addressErrorBool==true || placeInfo.capacityErrorBool==true){
  setPlaceInfo({...placeInfo, formValid:false })
} else{
  setPlaceInfo({...placeInfo, formValid:true })
}
}, [placeInfo.nameErrorBool, placeInfo.addressErrorBool, placeInfo.capacityErrorBool])
 
console.log(placeInfo)

 
  return (

    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <TextInput
            name='name'
            onChangeText={ (value) => {setPlaceInfo({...placeInfo, name: value})} }
            onBlur={nameValidator}
            //onEndEditing={emailValidator}
            autoCompleteType='name'
            style={styles.input}
            placeholder="Введите название"
        />
        <Text style={{color:'red'}}>{placeInfo.nameError}</Text>

        <TextInput
            name='street'
            onChangeText={ (value) => {setPlaceInfo({...placeInfo, address: value})} }
            //onEndEditing={emailValidator}
            onBlur={addressValidator}
            autoCompleteType='street-address'
            style={styles.input}
            placeholder="Введите адрес"
        />  
        <Text style={{color:'red'}}>{placeInfo.addressError}</Text>

        <TextInput
            name='capacity'
            onChangeText={ (value) => {setPlaceInfo({...placeInfo, capacity: value})} }
            //onEndEditing={emailValidator}
            onBlur={capacityValidator}
            keyboardType='numeric'
            style={styles.input}
            placeholder="Введите вместимость"
        /> 
        <Text style={{color:'red'}}>{placeInfo.capacityError}</Text>

        
        <Pressable
        onPress={isValidForm}
        //onPress={onPressHandlerScan}
        style={({pressed}) => [
              {backgroundColor: pressed? '#0038FF' : '#0094FF'},
              styles.btn
            ]}
        >
          <Text style={styles.textButton}>Сгенерировать</Text>
        </Pressable>
        <Pressable
        onPress={onPressHandlerOff}
        style={({pressed}) => [
              {backgroundColor: pressed? '#B1DEFF' : '#fff'},
              {borderWidth: 1, borderColor: '#D1D1D1'},
              styles.btn,
            ]}
        >
          <Text style={[styles.textButton, 
                        {color:'black',
                        fontFamily:'Inter-Medium'}]}>Выйти</Text>
        </Pressable>
      </View>
    </View>
  );

}



function AlreadyMax({navigation}){

  function TryToLine(){
    var body = "mod=" + "goToQueue" + "&userId="+ idUser + "&placeId="+ idPlace;
    req(body);
    setTimeout(()=>{
      if(reqResult !== 'error'){
        navigation.replace('ToLine');
      }
    },1000)
  }

  const backToBegin = () => {
      navigation.replace('QR');
  }

  return(
    <View style={{flex:1,
      //alignItems:'center',
      justifyContent:'center',
      backgroundColor:'#FFDD76'}}>
        <View style={{flex:2}}></View>
        <View style={{flex:1, alignItems:'center',
          justifyContent:'center', }}>
              <Text style={{fontSize:24,
                          fontFamily:'Inter-Bold',
                          color:'#C89600'}}>Нам жаль :( {"\n"}В данный момент все места заняты. {"\n"}Если у вас есть время, {"\n"}Вы можете встать в очередь</Text>
        </View>
        <View style={{flex:2, alignItems:'center',
          justifyContent:'center' }}>
            <Pressable
            onPress={TryToLine}
            style={({pressed}) => [
              {backgroundColor: pressed? '#E1FFE8' : '#fff'},
              styles.btn
            ]}
        >
          <Text style={[styles.textButton, 
                        {color:'black',
                        fontFamily:'Inter-Bold'}]}>Войти в очередь</Text>
    </Pressable>
              <Pressable
        onPress={backToBegin}
        style={({pressed}) => [
              {backgroundColor: pressed? '#FFCD38' : '#DEA700'},
              styles.btn
            ]}
        >
          <Text style={styles.textButton}>Выйти</Text>
    </Pressable>
        </View>           
</View>
  )
}

function ToLine({navigation}){

  const [linePlace, setLinePlace] = useState({
    place:'*',
  })

  var body = "mod="+"checkPlaceInQueue"+"&userId="+idUser+"&placeId="+idPlace;


  function wantToLeave(){
    //console.log(reqResult);
      clearInterval(timerLine);
      var bodyLeave = "mod="+"exitFromQueue"+"&userId="+idUser+"&placeId="+idPlace;
      req(bodyLeave);
      setTimeout(()=>{
        if(reqResult=='succes'){
          navigation.replace('QR');
        } 
      }, 1000)
    }


  var timerLine = setInterval(() => {req(body);
                                if(reqResult=='youAreOnPlace'){
                                  clearInterval(timerLine);
                                  navigation.replace('Go');
                                }else{setLinePlace({...linePlace, place: reqResult})}}, 10000);
  
  useEffect(()=>{
    if(linePlace.place=='succes' || linePlace.place=='youAreOnPlace' || linePlace.place=='youAreOnPlace'){
      clearInterval(timerLine);
    }
  },[linePlace.place])
  

  return(
    <View style={{flex:1,
      //alignItems:'center',
      justifyContent:'center',
      backgroundColor:'#FFDD76'}}>
        <View style={{flex:1}}></View>
        <View style={{flex:3, alignItems:'center',
          justifyContent:'center', }}>
              <Text style={{fontSize:24,
                          fontFamily:'Inter-Medium',
                          color:'#C89600'}}>Ваше место в очереди:</Text>
              <Text style={{fontSize:72,
                          fontFamily:'Inter-Bold',
                          color:'#fff'}}>{linePlace.place}</Text>
        </View>
        <View style={{flex:1, alignItems:'center',
          justifyContent:'center' }}>
            
              <Pressable
        onPress={wantToLeave}
        style={({pressed}) => [
              {backgroundColor: pressed? '#FFCD38' : '#DEA700'},
              styles.btn
            ]}
        >
          <Text style={styles.textButton}>Выйти из очереди</Text>
    </Pressable>
        </View>           
</View>
  )
}

function Go({navigation}){

  var body = "mod="+"checkMyTime"+"&userId="+ idUser +"&placeId="+ idPlace;

  let timer = setInterval(() => {
                                req(body);
                                if(reqResult=='goOut'){
                                  clearInterval(timer);
                                  navigation.replace('QR');
                                }}, 20000);

  function wantToLeave(){
    clearInterval(timer);
    var bodyLeave = "mod="+"exitFromPlace"+"&userId="+idUser+"&placeId="+idPlace;
    req(bodyLeave);
    setTimeout(()=>{
      if(reqResult=='succes'){
        navigation.replace('QR')
      }
    }, 1000)
  }

  return(
    <View style={{flex:1,
      //alignItems:'center',
      justifyContent:'center',
      backgroundColor:'#83FFA2'}}>
        <View style={{flex:2}}></View>
        <View style={{flex:1, alignItems:'center',
          justifyContent:'center', }}>
              <Text style={{fontSize:24,
                          fontFamily:'Inter-Bold',
                          color:'#00AD2B'}}>Добро пожаловать!{"\n"}Вы можете заниматься :)</Text>
        </View>
        <View style={{flex:2, alignItems:'center',
          justifyContent:'center' }}>
              <Pressable
              onPress={wantToLeave}
              style={({pressed}) => [
              {backgroundColor: pressed? '#3ABF5B' : '#2BD957'},
              styles.btn
            ]}
        >
          <Text style={styles.textButton}>Выйти</Text>
    </Pressable>
        </View>           
</View>
  )
}

function wantGo({navigation}){

 
  const onPressHandlerOut = () => {
    navigation.replace('QR');
  }

  function Start() {
    var body = "mod="+"start"+"&userId="+idUser+"&placeId="+idPlace;
    req(body);
    setTimeout(()=>{
      if(reqResult=='success'){
        navigation.replace('Go');
      }
    }, 1000)
  }

  return(
    <View style={{flex:1,
      //alignItems:'center',
      justifyContent:'center',
      backgroundColor:'#83FFA2'}}>
        <View style={{flex:2}}></View>
        <View style={{flex:1, alignItems:'center',
          justifyContent:'center', }}>
              <Text style={{fontSize:24,
                          fontFamily:'Inter-Bold',
                          color:'#00AD2B'}}>Места есть{"\n"}Зайдёте? :)</Text>
        </View>
        <View style={{flex:2, alignItems:'center',
          justifyContent:'center' }}>
            <Pressable
        onPress={Start}
        style={({pressed}) => [
              {backgroundColor: pressed? '#E1FFE8' : '#fff'},
              styles.btn
            ]}
        >
          <Text style={[styles.textButton, 
                        {color:'black',
                        fontFamily:'Inter-Bold'}]}>Захожу</Text>
          </Pressable>
              <Pressable
        onPress={onPressHandlerOut}
        style={({pressed}) => [
              {backgroundColor: pressed? '#3ABF5B' : '#2BD957'},
              styles.btn
            ]}
        >
          <Text style={styles.textButton}>Выйти</Text>
    </Pressable>
        </View>           
</View>
  )
}

function ErrorQR({navigation}){
  const onPressHandlerOut = () => {
    navigation.replace('QR');
  }
  return(
    <View style={{flex:1,
      //alignItems:'center',
      justifyContent:'center',
      backgroundColor:'#FFA6A6'}}>
        <View style={{flex:2}}></View>
        <View style={{flex:1, alignItems:'center',
          justifyContent:'center', }}>
              <Text style={{fontSize:24,
                          fontFamily:'Inter-Bold',
                          color:'#D90000'}}>Ошибка</Text>
        </View>
        <View style={{flex:2, alignItems:'center',
          justifyContent:'center' }}>
            
              <Pressable
        onPress={onPressHandlerOut}
        style={({pressed}) => [
              {backgroundColor: pressed? '#FF3838' : '#D90000'},
              styles.btn
            ]}
        >
          <Text style={styles.textButton}>Попробовать ещё раз</Text>
    </Pressable>
        </View>           
</View>
  )
}

function QRScanner({navigation}) {

const onPressHandler=()=>{
  navigation.replace('Main');
}
const [hasPermission, setHasPermission] = useState(null);
const [scanned, setScanned] = useState(false);
const [text, setText] = useState('Наведите камеру на QR')

const askForCameraPermission = () => {
  (async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  })()
}

// Request Camera Permission
useEffect(() => {
  askForCameraPermission();
}, []);

// What happens when we scan the bar code
const handleBarCodeScanned = ({ type, data }) => {
  setScanned(true);
  setText(data)
  console.log('Type: ' + type + '\nData: ' + data)
};

const tryStart = () =>{
  idPlace = text;
  var QRscan = "mod=" + "tryToStart" + "&userId="+ idUser + "&placeId="+ text;
  req(QRscan);
  setTimeout(()=>{
    if(reqResult=='alreadyMax'){
    console.log("1")
    navigation.replace('AlreadyMax');
  } else if(reqResult=='canStart'){
    console.log("2")
    navigation.replace('wantGo');
  } else if(reqResult=='error'){
    console.log("3")
    navigation.replace('ErrorQR');
  }},1000)
  
}


// Check permissions and return the screens
if (hasPermission === null) {
  return (
    <View style={styles.qrContainer}>
      <Text style={styles.text}>Запрос доступа к камере</Text>
    </View>)
}
if (hasPermission === false) {
  return (
    <View style={styles.qrContainer}>
      <Text style={[{ margin: 10, color:'white' }, styles.text]}>Нет доступа к камере</Text>
      <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
    </View>)
}

// Return the View
return (
  <View style={styles.qrContainer}>
    <View style={styles.qrBarcodebox}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ height: 600, width: 600 }} />
    </View>
    <Text style={styles.qrMaintext}>{scanned ? "Успешно!" : "Наведите камеру на QR"}</Text>
    <View style={styles.fixToText}>
    <Pressable
        onPress={onPressHandler}
        style={({pressed}) => [
              {backgroundColor: pressed? '#e1ffe8' : '#fff'},
              styles.btn,
              {width: '40%', marginRight: 15}
            ]}
        >
          <Text style={[styles.textButton, 
                        {color:'black',
                        fontFamily:'Inter-Medium'}]}>Выйти</Text>
    </Pressable>
    {scanned &&  <Pressable
        onPress={tryStart}
        style={({pressed}) => [
              {backgroundColor: pressed? '#0038FF' : '#0094FF'},
              styles.btn,
              {width: '40%'}
            ]}
        >
          <Text style={styles.textButton}>Далее</Text>
    </Pressable>}
    </View>
    {scanned && <Pressable
        onPress={() => setScanned(false)}
        style={({pressed}) => [
              {backgroundColor: pressed? '#e1ffe8' : '#fff'},
              styles.btn,
              {width: '82%'}
            ]}
        >
          <Text style={[styles.textButton, 
                        {color:'black',
                        fontFamily:'Inter-Medium'}]}>Ещё раз</Text>
    </Pressable>}
    
  </View>
    
);

}

const styles = StyleSheet.create({
  fixToText:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  logoContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'black',
  },
  contentContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLogo: {
    fontFamily: 'Raleway',
    fontSize: 24,
  },
  textUnderLogo: {
    color:'#0094FF',
    fontFamily:'Inter-Medium',
    fontSize: 14,
  },
  textButton:{
    fontSize: 18,
    fontFamily:'Inter-Bold',
    color: "white",
  },
  text:{
    fontSize: 18,
    fontFamily:'Inter-Medium'
  },
  button:{
    paddingVertical: 10,
    width: "75%",
    borderRadius: 25,
  },
  btn:{
    width: "75%",
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  qrContainer: {
    flex: 1,
    //backgroundColor: '#1C1C1C',
    backgroundColor: 'rgba(28, 28, 28, 1.0)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrMaintext: {
    fontSize: 24,
    margin: 20,
    color: 'white',
    fontFamily:'Inter-Medium',
  },
  qrBarcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 30,
    backgroundColor: 'white'
  },
  input:{
    width: "75%",
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D1D1D1',
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  }
});

export default App;