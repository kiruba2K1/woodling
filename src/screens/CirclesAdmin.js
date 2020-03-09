/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  ScrollView,
  Modal,
  ImageBackground,
  TouchableOpacity,
  FlatList
} from 'react-native';

import fontelloConfig from '../config.json';
import { Switch } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const Customon = createIconSetFromFontello(fontelloConfig);
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { Avatar } from 'react-native-paper';
import { apiurl,imageurl } from '../constants/config';
import axios from 'axios';
import Video from 'react-native-video';
import TextView from '../components/TextView';

import firebase from 'react-native-firebase';

export default class MyComponent extends Component {

  componentDidMount() {

    const { navigation } = this.props;
    const groupKey = navigation.getParam('groupkey');
    const user_id = navigation.getParam('user_id');
    var isCurrentUserAdmin = false;
    var currentUserIndex = -1;

    console.log("groupKey",groupKey);
      try{
            this.newref = firebase
              .firestore()
              .collection('circles')
              .doc(groupKey)
              .get()
              .then(snapshot => {
                console.log("------ Data : ",snapshot.data());
                var admin = [];
                var nonAdmin = [];
                snapshot.data().members.forEach((item,index)=>{
                  if(item.isAdmin){
                    admin.push(item);
                    if(item.id == user_id){
                      isCurrentUserAdmin = true;
                      currentUserIndex = index;
                      console.log("Admin ID : " + item.id + " : " + currentUserIndex);
                    }

                  }else{
                    nonAdmin.push(item);
                    if(item.id == user_id){
                      currentUserIndex = index;
                      console.log("NonAdmin ID : " + item.id + " : " + currentUserIndex);
                    }

                  }
                });
                this.setState({
                  circleData:snapshot.data(),
                  allMembers:snapshot.data().members,
                  admin:admin,
                  nonAdmin:nonAdmin,
                  isCurrentUserAdmin:isCurrentUserAdmin,
                  privacy:snapshot.data().privacy,
                  currentUserIndex:currentUserIndex,
                  });
              });
        //  console.log(data);
      }catch(error){
        alert(error);
      }
      this.getCircleMedia(groupKey);
  }

  getCircleMedia(groupKey){

    console.log("------ Get images from groupID : ",groupKey);

    axios
      .get(`${apiurl}fetch-chat-image.php?group_token=${groupKey}`)
      .then(res =>{
        console.log("fetch-chat-image : ", res.data);
        this.setState({ mediaImages: res.data.data })
      })
      .catch(res => console.log(res));
    }

  state = {
    colorTrueSwitchIsOn: true,
    colorFalseSwitchIsOn: false,
    allMembers:[],
    selectedIndex:-1,
    modalVisible: false,
    mediaImages:[],
  };

  _handleButtonPress = (index,name) => {
    this.setModalVisible(true);
    this.setState({
      selectedIndex:index,
      username:name,
      });
  };

  setModalVisible = (visible) => {

    if(!visible){
      this.setState({
        selectedIndex:-1,
        modalVisible: visible,
        });
    }else{
      this.setState({modalVisible: visible});
    }
  }

  adminRender(item,index){

    const { navigation} = this.props;
    const user_id = navigation.getParam('user_id');

    if(item.id != user_id){
        return (<View style={styles.addSection}>
              <Image
                source={{
                uri: item.profile_thumb,}}
                  style={{ width: 49, height: 49,  borderRadius: 30, marginBottom:10 }}/>
              <Text style={{color: '#212121', fontSize:14, fontFamily: 'Poppins-Medium', textAlign: 'center'}}>{item.username}</Text>
        </View>);
    }else{
      return (<View style={styles.addSection}>
            <Image
              source={{
              uri: item.profile_thumb,}}
                style={{ width: 49, height: 49,  borderRadius: 30, marginBottom:10 }}/>
            <Text style={{color: '#212121', fontSize:14, fontFamily: 'Poppins-Medium', textAlign: 'center'}}>You</Text>
      </View>);
    }
  }

  nonAdminRender(item,index){
    const { navigation} = this.props;
    const user_id = navigation.getParam('user_id');

    if(item.id != user_id){
      return (
        <View style={{flexDirection:'row'}}>
            <View style={styles.addSection}>
                <Image
                  source={{
                  uri: item.profile_thumb,}}
                    style={{ width: 49, height: 49,  borderRadius: 30, marginBottom:10 }} />
                <Text style={{color: '#212121', fontSize:14, fontFamily: 'Poppins-Medium', textAlign: 'center'}}>{item.username}</Text>
            </View>

            <TouchableOpacity style={{marginLeft: -5}} onPress={()=>this._handleButtonPress(index,item.username)}>
              <FontAwesome5 style={styles.arrowback2} name="ellipsis-v" size={14} />
            </TouchableOpacity>
        </View>);
      }else{
        return(
        <View style={{flexDirection:'row'}}>
            <View style={styles.addSection}>
                <Image
                  source={{
                  uri: item.profile_thumb,}}
                    style={{ width: 49, height: 49,  borderRadius: 30, marginBottom:10 }} />
                <Text style={{color: '#212121', fontSize:14, fontFamily: 'Poppins-Medium', textAlign: 'center'}}>You</Text>
            </View>

            <TouchableOpacity style={{marginLeft: -5}} onPress={()=>this._handleButtonPress(index,item.username)}>
              <FontAwesome5 style={styles.arrowback2} name="ellipsis-v" size={14} />
            </TouchableOpacity>
        </View>);
      }

  }

  addNewNonAdmin(){
    this.props.navigation.navigate('AddCircleMembers',{onSelect:this.onSelect,isCircleAdmin:true,members:this.state.allMembers});
  }
  addNewAdmin(){
    this.props.navigation.navigate('AddCircleMembers',{onSelect:this.onSelect,isCircleAdmin:true,isAdmin:true,members:this.state.allMembers});
  }

  onSelect = data => {
    console.log(" onSelect: ", data)
    var {allMembers, circleData} = this.state;
    const { navigation } = this.props;
    const groupKey = navigation.getParam('groupkey');

    console.log("Old All Members : ",allMembers);
    allMembers = [...allMembers,...data];

    data.forEach(element => {
      firebase
        .firestore()
        .collection('users')
        .doc(element.id)
        .collection('grouplist')
        .add({ groupkey:groupKey });
    });

    const newArray = [];
    allMembers.forEach(obj => {
      if (!newArray.some(o => o.id === obj.id)) {
        newArray.push({ ...obj })
      }
    });
    //console.log("New All Members : ",newArray);

    console.log("Old Data : " ,circleData );
    circleData.members = newArray;
    console.log("New Data : " ,circleData);

    this.updateFirestoreData(circleData);
  };

  removeFromGroup(){

    const {selectedIndex,admin} = this.state;
    var {nonAdmin,allMembers,circleData} = this.state;
    const { navigation,user_id } = this.props;
    const groupKey = navigation.getParam('groupkey');

    console.log("remove index : " + selectedIndex);

    const user = nonAdmin[selectedIndex];
    if (selectedIndex !== -1) {
      nonAdmin.splice(selectedIndex, 1);
    }

    console.log("User ID : " + user.id)
    //alert(user.id);
    this.chatlistref = firebase
      .firestore()
      .collection('users')
      .doc(user.id)
      .collection('grouplist');
      //.doc('lBH7kpMv3UNNm4KiVDLA');


      let query = this.chatlistref.where('groupkey', '==', groupKey).get()
        .then(snapshot => {
          if (snapshot.empty) {
            console.log('No matching documents.');
            return;
          }

          snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            firebase
              .firestore()
              .collection('users')
              .doc(user.id)
              .collection('grouplist')
              .doc(doc.id)
              .delete();
          });
        })
        .catch(err => {
          console.log('Error getting documents', err);
        });



      // this.chatlistref.where("groupkey", '==', 'c6267382-4c30-4dff-aa85-6ebc43fb9464')
      // .get()
      // .then((querySnapshot) => {
      //     console.log("------D1 : ",querySnapshot);
      // });

      {
        // var removeCapital = this.chatlistref.update({
        //     groupkey: firebase.firestore.FieldValue.delete()
        // });
      }

    allMembers = [...nonAdmin,...admin]

    console.log("Old Data : " ,circleData );
    circleData.members = allMembers;
    console.log("New Data : " ,circleData );

    this.setModalVisible(false);

    this.updateFirestoreData(circleData);
  }

  disbandGroup(){

    const {currentUserIndex,admin} = this.state;
    var {nonAdmin,allMembers,circleData} = this.state;
    const { navigation } = this.props;
    const groupKey = navigation.getParam('groupkey');
    const user_id = navigation.getParam('user_id');

    console.log("remove index : " + currentUserIndex);

    const user = allMembers[currentUserIndex];
    if (currentUserIndex !== -1) {
      allMembers.splice(currentUserIndex, 1);
    }

    console.log("User ID : " + user_id  )
    //alert(user.id);
    this.chatlistref = firebase
      .firestore()
      .collection('users')
      .doc(user_id)
      .collection('grouplist');
      //.doc('lBH7kpMv3UNNm4KiVDLA');


      let query = this.chatlistref.where('groupkey', '==', groupKey).get()
        .then(snapshot => {
          if (snapshot.empty) {
            console.log('No matching documents.');
            return;
          }

          snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            firebase
              .firestore()
              .collection('users')
              .doc(user_id)
              .collection('grouplist')
              .doc(doc.id)
              .delete();
          });
        })
        .catch(err => {
          console.log('Error getting documents', err);
        });

    //allMembers = [...nonAdmin,...admin]

    console.log("Old Data : " ,circleData );
    circleData.members = allMembers;
    console.log("New Data : " ,circleData );

    this.setModalVisible(false);

    this.updateFirestoreData(circleData,true);
  }

  viewProfile(){
    const { navigation,user_id } = this.props;
    const {selectedIndex,admin} = this.state;
    console.log("User Data : " , admin[selectedIndex]);
    this.setModalVisible(false);
    this.props.navigation.navigate("ProfileScreen",{user_id:user_id,theirid:admin[selectedIndex].id})
  }

  updateFirestoreData(circleData,isDisband){
    var admin = [];
    var nonAdmin = [];
    circleData.members.forEach((item)=>{
      if(item.isAdmin){
        admin.push(item);
      }else{
        nonAdmin.push(item);
      }
    });

    this.setState({
      circleData:circleData,
      allMembers:circleData.members,
      admin:admin,
      nonAdmin:nonAdmin,
      });

    const { navigation,user_id } = this.props;
    const groupKey = navigation.getParam('groupkey');

    this.ref = firebase
      .firestore()
      .collection('circles')
      .doc(groupKey);

      this.ref.set(circleData).then(res => {
        const getDoc = this.ref
          .get()
          .then(doc => {
            console.log("Doc : " , doc)
          })
          .catch(err => {
            console.log('Error getting document', err);
          });
      });

      this.ref2 = firebase
        .firestore()
        .collection('users')
        .doc(groupKey);

      if(isDisband){
        const { navigation } = this.props;
        navigation.goBack();
        navigation.state.params.onSelect();
      }
  }

  render() {
    const { navigation} = this.props;
    const name = navigation.getParam('name','Group');
    const path = navigation.getParam('path','');
    var modalBackgroundStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center'
    };
    var innerContainerTransparentStyle = {
      width: 286,
    height: 218,
    shadowColor: 'rgba(0, 0, 0, 0.24)',
    shadowOffset: { width: 4, height: 0 },
    shadowRadius: 8,
    borderRadius: 8,

    backgroundColor: '#f7f8f9',

    //backgroundColor: '#ffffff',
    };

    const { isSwitchOn,allMembers, admin, nonAdmin, mediaImages, privacy, isCurrentUserAdmin } = this.state;
    return (
      <View style={styles.container}>

          <View style={styles.header2}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                      <Customon style={styles.arrowback} name="long-arrow-left" size={12} />
                    </TouchableOpacity>
                    <Text> {name} </Text>
                    <TouchableOpacity>
                      <FontAwesome5 style={styles.arrowback2} name="ellipsis-v" size={12} />
                    </TouchableOpacity>
                </View>

                {path != '' ? (
                  <Avatar.Image
                    size={30}
                    rounded
                    source={{
                      uri: path

                    }}
                    style={{marginTop:-15}}
                  />
                ) :(
                  <Avatar.Image
                    size={30}
                    rounded
                    source={{
                      uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'
                    }}
                    style={{marginTop:-15}}
                  />
                ) }
          </View>

            <ScrollView>
                <View style={styles.containerAdmin}>
                    <Text style={{color: '#757575', fontSize:12, fontFamily: 'Poppins-Medium'}}>Admin ({admin !=undefined ? admin.length : 0})</Text>

                  <View style={{flexDirection:'row', marginTop: 10, marginBottom: 10}}>

                      {isCurrentUserAdmin ? (
                        <View style={styles.addSection}>
                            <TouchableOpacity onPress={()=>this.addNewAdmin()}>
                                  <Avatar.Icon
                                  size={50}
                                  icon={() => <Customon name="plus" color="#fff" size={22} />}
                                  style={{backgroundColor:'#fb0201', marginBottom: 10}}
                                  />
                            </TouchableOpacity>
                            <Text style={{color: '#212121', fontSize:14, fontFamily: 'Poppins-Medium', textAlign: 'center'}}>Add</Text>
                        </View>
                        ) : (null)}


                      <FlatList
                          showsHorizontalScrollIndicator={false}
                          style={{marginTop:10}}
                          horizontal
                          data={admin}
                          renderItem={({ item,index }) =>this.adminRender(item,index)}
                          keyExtractor={item => item.toString()}
                      />
                  </View>


                  <Text style={{color: '#757575', fontSize:12, fontFamily: 'Poppins-Medium'}}>Member ({nonAdmin !=undefined ? nonAdmin.length : 0})</Text>
                  <View style={{flexDirection:'row', marginTop: 10, marginBottom: 10}}>

                  {isCurrentUserAdmin ? (
                  <View style={styles.addSection}>
                      <TouchableOpacity onPress={()=>this.addNewNonAdmin()}>
                            <Avatar.Icon
                            size={50}
                            icon={() => <Customon name="plus" color="#fff" size={22} />}
                            style={{backgroundColor:'#fb0201', marginBottom: 10}}
                            />
                      </TouchableOpacity>
                      <TextView text='Add' style={{color: '#212121', fontSize:14, fontFamily: 'Poppins-Medium', textAlign: 'center'}} />
                  </View>
                  ) : (null)}

                  <FlatList
                      showsHorizontalScrollIndicator={false}
                      style={{marginTop:10}}
                      horizontal
                      data={nonAdmin}
                      renderItem={({ item,index }) =>this.nonAdminRender(item,index)}
                      keyExtractor={item => item.toString()}
                  />

                  </View>
                </View>


                  <View style={styles.media}>
                    <Text style={{color: '#757575', fontSize:12, fontFamily: 'Poppins-Medium'}}>Media ({mediaImages.length})</Text>
                    <View style={styles.mediaScroll}>

                    {
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            style={{marginTop:10}}
                            horizontal
                            data={mediaImages}
                            renderItem={({ item,index }) =>(
                              item.type == 'image' ?
                              <Image
                              source={{
                              uri: item.image_url,}}
                                style={styles.img}
                              /> :
                                <View style={styles.video}>
                                  <Video
                                    useTextureView={false}
                                    source={{ uri: item.video_url }} // Can be a URL or a local file.
                                    ref={ref => {
                                      this.player = ref;
                                    }}
                                    style={styles.img}
                                    muted={true}
                                    paused={true}
                                    posterResizeMode='stretch'
                                    resizeMode='stretch'
                                  />
                                  <View style={[styles.img,{position: 'absolute',alignItems:'center',justifyContent:'center'}]}>
                                    <FontAwesome5 color='white' name="play-circle" size={25} />
                                  </View>
                                </View>

                              )}
                            keyExtractor={item => item.toString()}
                        />
                      }


                    </View>
                  </View>

                  <View style={styles.notifications}>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TextView style={{color: '#757575', fontSize:16, fontFamily: 'Poppins-Medium'}} text='Mute Notifications' />
                        <Switch
                          onValueChange={(value) => this.setState({ colorFalseSwitchIsOn: value })}
                          onTintColor="#0ce0b5"
                          style={{
                            height: 15,

                          }}
                          thumbTintColor="#cccc"
                          tintColor="#000"
                          value={this.state.colorFalseSwitchIsOn} />
                      </View>
                  </View>

                  {isCurrentUserAdmin ? (
                    <TouchableOpacity onPress={()=>this.disbandGroup()} style={styles.disband}>
                      <TextView style={{color: '#fb0201', fontSize:16, fontFamily: 'Poppins-Medium'}} text='Disband group' />
                    </TouchableOpacity>
                    ) : (null)}

            </ScrollView>


            <Modal
                      animationType='slide'
                      transparent={true}
                      visible={this.state.modalVisible}
                      onRequestClose={() => this.setModalVisible(false)}>

                      <View style={[styles.container, modalBackgroundStyle]}>

                        <View style={innerContainerTransparentStyle}>
                      <View style={{flexDirection: 'row',
                       borderBottomWidth:1,
                       borderBottomColor: '#ced6e0',
                       marginBottom: 8,
                       padding: 10,}}>
                      <View>
                    <FontAwesome5 name="times" color= "#ced6e0"  size={14}
                  onPress={this.setModalVisible.bind(this, false)} />
                    </View>
                    <View style={{flex:1.5, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{color: '#000', fontSize:12, fontFamily: 'Poppins-Medium'}}>{this.state.username}</Text>
                  </View>
                  </View>
                  <View style={{borderBottomWidth:'#ced6e0', borderBottomWidth:0.2, paddingLeft: 10, paddingBottom: 5}}>
                  <TextView style={{color: '#212121', fontSize:10, fontFamily: 'Poppins-Medium', marginBottom: 5}} text='Option' />
                  <TouchableOpacity onPress={()=>this.viewProfile()}>
                  <TextView style={{color: '#212121', fontSize:12, fontFamily: 'Poppins-Medium', marginBottom: 5}} text='View Profile' />
                    </TouchableOpacity>
                  </View>
                  <View style={{ borderBottomWidth:'#ced6e0', borderBottomWidth:0.2, paddingLeft: 10, paddingBottom: 5, paddingTop: 8}}>
                    <TouchableOpacity>
                  <TextView style={{color: '#212121', fontSize:10, fontFamily: 'Poppins-Medium', marginBottom: 5}} text='Mute'/>
                    </TouchableOpacity>
                  </View>

                  {this.state.isCurrentUserAdmin ? (
                    <View style={{borderBottomWidth:'#ced6e0', borderBottomWidth:0.2, paddingLeft: 10, paddingBottom: 5, paddingTop: 8}}>
                        <TouchableOpacity onPress={()=>this.removeFromGroup()}>
                            <TextView style={{color: '#fb0201', fontSize:10, fontFamily: 'Poppins-Medium', marginBottom: 5}} text='Remove from group' />
                        </TouchableOpacity>
                    </View>
                    ) : (null)
                  }

                  <View style={{paddingLeft: 10, paddingBottom: 5}}>
                  <TouchableOpacity>
                  <TextView style={{color: '#fb0201', fontSize:10, fontFamily: 'Poppins-Medium', marginBottom: 5, paddingTop: 8}} text='Report' />
                  </TouchableOpacity>
                  </View>

                    </View>
                      </View>
                    </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  disband:{
    width: Dimensions.get('window').width,
    padding: 15,
        backgroundColor: '#ffffff',
        marginBottom: 18,

    },
  notifications: {
    width: Dimensions.get('window').width,
    padding: 15,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#ced6e0',

    },
  img: {
    width: 94,
    height: 94,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowRadius: 16,
    borderRadius: 20,
    marginTop: 10,
    overflow: 'hidden',
    marginRight: 6,
    elevation: 5,

    },
    video: {
      shadowColor: '#000',
      shadowOffset: { width: 4, height: 0 },
      shadowRadius: 16,
      borderRadius: 20,
      overflow: 'hidden',
      elevation: 5,
      alignItems:'center',
      justifyContent:'center'
      },
  mediaScroll: {
    flexDirection: 'row',
    },
  media:{
    width: Dimensions.get('window').width,
    padding: 15,
      backgroundColor: '#ffff',
      marginBottom: 18,
    },
  addSection:{
    padding: 7,
    //width: 70,
    justifyContent: 'center',
    alignItems: 'center'
},
  containerAdmin: {
    width: Dimensions.get('window').width,
    backgroundColor: '#ffff',
    padding: 15,
    marginTop: 54,
    marginBottom: 18,

  },
  headerProfile:{
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -3
  },
  header: {
    width: Dimensions.get('window').width,
    height: 65,
    //backgroundColor: '#ffff',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
    shadowOffset: { width: 3, height: 0 },
    //elevation: 5,
  },

    header2: {
      width: Dimensions.get('window').width,
      height: 65,
      backgroundColor: '#ffff',
      //justifyContent: 'space-between',
      //alignItems: 'center',
      //flexDirection: 'row',
      //padding: 15,
      paddingTop: 10,
      shadowOffset: { width: 3, height: 0 },
      elevation: 5,
      alignItems:'center',
      justifyContent:'center'
  },
  titleHeader: {
    //  width: 375,
    //marginTop: 20,
    height: 112,
    backgroundColor: '#ffffff',
    opacity: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,

  },

  arrowback2: {
    color: '#000',
  },
  arrowback: {
    color: '#000',
  },

  headerArrow: {
    flex: 1,

  },

  headerTitle: {
    flex: 2,
    marginLeft: 35,
    //alignItems: 'center',
    justifyContent: 'center',

  },

});
