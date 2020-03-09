
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Dimensions,
  FlatList
} from 'react-native';
import {connect} from 'react-redux';
import fontelloConfig from '../config.json';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Axios from 'axios';
import { apiurl, imageurl } from '../constants/config.js';
import { ActivityIndicator } from 'react-native-paper';
import { withNavigation } from 'react-navigation';
import Toast from 'react-native-root-toast';
const Customon = createIconSetFromFontello(fontelloConfig);
import TextView from '../components/TextView';

class BlockedAccount extends Component {


  constructor(props){
    super(props)
    this.state={
      details:[],
      loading:false,
      refreshing:false
    }
  }

  componentDidMount(){
    this.getBlockedAccounts()

  }

  getBlockedAccounts=()=>{
    this.setState({loading:true})
    Axios
    .get(
      `${apiurl}fetch-blocked-users.php?user_id=${this.props.user_id}`,
    )
    .then(res => {
      if(res.data.status=='success')
      {
        this.setState({details: res.data.blocked_users,loading:false,refreshing:false});
      }
      else
      {
        if(res.data.status!='empty')
       {
         Toast.show("Error occurred please try again later", {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: 'red',
          textColor: 'white',
        });
      }

        this.setState({loading:false,refreshing:false})
      }
    })
    .catch(res => {
          this.setState({loading:false,refreshing:false})
          Toast.show(res.message, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: 'red',
            textColor: 'white',
          });
    });
  }

  onSave=(Id)=>{
    this.setState({refreshing:true})
    Axios.post(`${apiurl}unblock-user.php?user_id=${this.props.user_id}&blocked_id=${Id}`).then(res => {
      if(res.data.status=='success')
      {
        var NewArray=this.state.details.filter(value=>{
          return value.blocked_id!=Id;
        })
        this.setState({details:NewArray})
        Toast.show("User Unblocked", {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: 'red',
          textColor: 'white',
        });
      }
      else
      {
        Toast.show("Error occurred please try again.", {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: 'red',
          textColor: 'white',
        });
      }
      this.setState({refreshing:false})

    })
    .catch(res => {
      this.setState({refreshing:false})
          Toast.show(res.message, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: 'red',
            textColor: 'white',
          });
    });
  }

  onRefresh=()=>{
    this.setState({refreshing:true,details:[]},()=>{
      this.getBlockedAccounts();
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" translucent={false} />
        <View style={styles.header}>
          <View style={styles.headerArrow}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Customon style={styles.arrowback} name="long-arrow-left" size={15}/>
            </TouchableOpacity>
          </View>
          <View style={styles.headerTitle}>
            <TextView style={styles.title} text='Blocked Accounts'></TextView>
          </View>
          </View>
          <FlatList
          onRefresh={this.onRefresh}
          refreshing={this.state.refreshing}
            data={this.state.details}
            ListFooterComponent={
              this.state.loading?
              <View style={{marginVertical:10}}>
              <ActivityIndicator size={30} color="red"/>
              </View>
              :null
            }
            renderItem={({item,index})=>{
              return(
                <View style={styles.notification}>
            <View style={styles.wrapper}>
            <Image source={item.profile_picture?{uri:imageurl+"/"+item.profile_picture}:require('../images/ic_account_circle_24px.jpg')} style={styles.avatar} />
            <View style={{justifyContent:'center', paddingLeft:8}}>
            <Text style={styles.title2}>{item.username}</Text>
            {/* <Text style={styles.comments}>@{item.username}</Text> */}
            </View>
            </View>

            <View style ={{alignItems:'flex-end', justifyContent: 'center'}} >
            <TouchableOpacity
              style={styles.buttoncontainer}
              onPress={()=>this.onSave(item.blocked_id)}>
              <TextView style={styles.buttontext} text='Unblock'>  </TextView>
            </TouchableOpacity>
            </View>
          </View>
              )
            }}
          />
  {/* <ScrollView>
          <View style={styles.notification}>
            <View style={styles.wrapper}>
            <Image source={require('../images/ic_account_circle_24px.jpg')} style={styles.avatar} />
            <View style={{justifyContent:'center', paddingLeft:8}}>
            <Text style={styles.title2}>Osvaldo Parma</Text>
            <Text style={styles.comments}>@osvaldo_pm</Text>
            </View>
            </View>

            <View style ={{alignItems:'flex-end', justifyContent: 'center'}} >
            <TouchableOpacity
              style={styles.buttoncontainer}
              onPress={this.onSave}>
              <Text style={styles.buttontext}> Unblocked </Text>
            </TouchableOpacity>
            </View>
          </View>

          <View style={styles.notification}>
            <View style={styles.wrapper}>
            <Image source={require('../images/ic_account_circle_24px.jpg')} style={styles.avatar} />
            <View style={{justifyContent:'center', paddingLeft:8}}>
            <Text style={styles.title2}>Osvaldo Parma</Text>
            <Text style={styles.comments}>@osvaldo_pm</Text>
            </View>
            </View>

            <View style ={{alignItems:'flex-end', justifyContent: 'center'}} >
            <TouchableOpacity
              style={styles.buttoncontainer}
              onPress={this.onSave}>
              <Text style={styles.buttontext}> Unblocked </Text>
            </TouchableOpacity>
            </View>
          </View>

          <View style={styles.notification}>
            <View style={styles.wrapper}>
            <Image source={require('../images/ic_account_circle_24px.jpg')} style={styles.avatar} />
            <View style={{justifyContent:'center', paddingLeft:8}}>
            <Text style={styles.title2}>Osvaldo Parma</Text>
            <Text style={styles.comments}>@osvaldo_pm</Text>
            </View>
            </View>

            <View style ={{alignItems:'flex-end', justifyContent: 'center'}} >
            <TouchableOpacity
              style={styles.buttoncontainer}
              onPress={this.onSave}>
              <Text style={styles.buttontext}> Unblocked </Text>
            </TouchableOpacity>
            </View>
          </View>

          <View style={styles.notification}>
            <View style={styles.wrapper}>
            <Image source={require('../images/ic_account_circle_24px.jpg')} style={styles.avatar} />
            <View style={{justifyContent:'center', paddingLeft:8}}>
            <Text style={styles.title2}>Osvaldo Parma</Text>
            <Text style={styles.comments}>@osvaldo_pm</Text>
            </View>
            </View>

            <View style ={{alignItems:'flex-end', justifyContent: 'center'}} >
            <TouchableOpacity
              style={styles.buttoncontainer}
              onPress={this.onSave}>
              <Text style={styles.buttontext}> Unblocked </Text>
            </TouchableOpacity>
            </View>
          </View>

          <View style={styles.notification}>
            <View style={styles.wrapper}>
            <Image source={require('../images/ic_account_circle_24px.jpg')} style={styles.avatar} />
            <View style={{justifyContent:'center', paddingLeft:8}}>
            <Text style={styles.title2}>Osvaldo Parma</Text>
            <Text style={styles.comments}>@osvaldo_pm</Text>
            </View>
            </View>

            <View style ={{alignItems:'flex-end', justifyContent: 'center'}} >
            <TouchableOpacity
              style={styles.buttoncontainer}
              onPress={this.onSave}>
              <Text style={styles.buttontext}> Unblocked </Text>
            </TouchableOpacity>
            </View>
          </View>

          <View style={styles.notification}>
            <View style={styles.wrapper}>
            <Image source={require('../images/ic_account_circle_24px.jpg')} style={styles.avatar} />
            <View style={{justifyContent:'center', paddingLeft:8}}>
            <Text style={styles.title2}>Osvaldo Parma</Text>
            <Text style={styles.comments}>@osvaldo_pm</Text>
            </View>
            </View>

            <View style ={{alignItems:'flex-end', justifyContent: 'center'}} >
            <TouchableOpacity
              style={styles.buttoncontainer}
              onPress={this.onSave}>
              <Text style={styles.buttontext}> Unblocked </Text>
            </TouchableOpacity>
            </View>
          </View>

          <View style={styles.notification}>
            <View style={styles.wrapper}>
            <Image source={require('../images/ic_account_circle_24px.jpg')} style={styles.avatar} />
            <View style={{justifyContent:'center', paddingLeft:8}}>
            <Text style={styles.title2}>Osvaldo Parma</Text>
            <Text style={styles.comments}>@osvaldo_pm</Text>
            </View>
            </View>

            <View style ={{alignItems:'flex-end', justifyContent: 'center'}} >
            <TouchableOpacity
              style={styles.buttoncontainer}
              onPress={this.onSave}>
              <Text style={styles.buttontext}> Unblocked </Text>
            </TouchableOpacity>
            </View>
          </View>

          <View style={styles.notification}>
            <View style={styles.wrapper}>
            <Image source={require('../images/ic_account_circle_24px.jpg')} style={styles.avatar} />
            <View style={{justifyContent:'center', paddingLeft:8}}>
            <Text style={styles.title2}>Osvaldo Parma</Text>
            <Text style={styles.comments}>@osvaldo_pm</Text>
            </View>
            </View>

            <View style ={{alignItems:'flex-end', justifyContent: 'center'}} >
            <TouchableOpacity
              style={styles.buttoncontainer}
              onPress={this.onSave}>
              <Text style={styles.buttontext}> Unblocked </Text>
            </TouchableOpacity>
            </View>
          </View>
</ScrollView> */}
        </View>
    );
  }
}

const mapStateToProps = state => ({
  user_id: state.userid.id,
});
export default connect(mapStateToProps)(BlockedAccount);


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttontext: {
    color: '#ffff',
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
  },
  buttoncontainer: {
    width: 66,
    height: 30,
    backgroundColor: '#fb0201',
    shadowRadius: 2,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comments:{
    color: '#818488',
    fontFamily: 'Poppins-Medium',
    fontSize: 8,
  },
  wrapper:{
    padding:20,
  flexDirection: 'row'
    },
  avatar: {
    width: 58,
    height: 58,
    borderRadius:50
  },
  title2:{
    fontSize:12,
    color: '#2c2c2c',
    fontFamily: 'Poppins-Medium',

  },
  notification: {
    width: Dimensions.get('window').width,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingRight: 15,
    paddingLeft: 8,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  header: {
    width: Dimensions.get('window').width,
    height: 60,
    backgroundColor: '#ffff',
    //  justifyContent: 'space-between',
    // alignItems: 'center',
    flexDirection: 'row',
    padding: 15,

    shadowOffset: { width: 3, height: 0 },
    elevation: 5
  },

  title: {
    color: '#000',
    fontFamily: 'Poppins-Medium',
    fontSize: 16
  },

  arrowback: {
    color: '#000'
  },

  headerArrow: {
    flex: 1
  },

  headerTitle: {
    flex: 2,
    // marginLeft: 35,
    // alignItems: 'center',
    justifyContent: 'center'
  }
});
