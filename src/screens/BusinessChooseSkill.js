import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  FlatList,
  TextInput,
  StatusBar,
  AsyncStorage
} from 'react-native';
import {withNavigation} from 'react-navigation';
import {connect} from 'react-redux';
import {Modal, Portal, Provider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import axios from 'axios';
import {individualSentData} from '../redux/actions/individualformdata';
import {localurl, apiurl} from '../constants/config';
import TextView from '../components/TextView';
import language from "../constants/language.js"
import fontelloConfig from '../config.json';

const Customon = createIconSetFromFontello(fontelloConfig);

const {width, height} = Dimensions.get('window');

const selected = [];

// eslint-disable-next-line react/prefer-stateless-function
class BusinessChooseSkill extends Component {
  constructor(props) {
    super(props);
    this._retrieveData();
    this.state = {
      data: [],
      searchedData: [],
      searchField: '',
      visible: false,
      customskillset: '',
      loading: false,
    };
    this.hideModal = this.hideModal.bind(this);
    this.customSkill = this.customSkill.bind(this);
    this.onDone = this.onDone.bind(this);
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('lan');
      if (value !== null) {
        // We have data!!
        console.log(value);
        //alert(value);
        if(value == 'fr'){
          this.setState({
            lan:'fr',
          });
        }else{
          this.setState({
            lan:'en',
          });
        }
      }else{
        alert("Else exicute : " + value);
      }
    } catch (error) {
      //alert("error");
      console.log("--------- Error",error);
      // Error retrieving data
    }
  };

  componentDidMount() {
    axios
      .get(`${apiurl}fetch-business-skills.php`)
      .then(res => this.setState({data: res.data.data}))
      .catch(res => console.log(res.data));
  }

  componentDidUpdate() {
    console.log(this.props.formdata);
  }

  onDone() {
    const {formdata, user_id, navigation} = this.props;
    const body = new FormData();
    const skills = [];
    selected.forEach(element => {
      if (element.id.includes('custom')) {
        skills.push(element.name);
      } else {
        skills.push(element.id);
      }
    });
    if (formdata.length === 0) {
      return alert('please enter valid fields');
    }
    const skillset = skills.join();
    console.log(formdata);
    body.append('user_id', user_id);
    body.append('account_type', 'business');
    body.append('photo', formdata.photo);
    body.append('business_name', formdata.business_name);
    body.append('business_description', formdata.business_description);
    body.append('business_phone', formdata.business_phone);
    body.append('city', formdata.city);
    body.append('country', formdata.business_name);
    body.append('formatted_address', formdata.formatted_address);
    body.append('lat', formdata.lat);
    body.append('lng', formdata.lng);
    body.append('skillset', skillset);
    console.log(body);
    this.setState({loading: true});
    axios
      .post(`${apiurl}update-user-setup-details.php`, body)
      .then(res => {
        console.log(res.data);
        if (res.data.status === 'success') {
          navigation.navigate('SetupWelcomeScreen');
        } else {
          alert(res.data.message);
        }
      })
      .catch(res => console.log('error'));
    this.setState({loading: false});
  }

  roleSelected(value) {
    if (selected.length >= 5) {
      alert('please enter 5');
    }
    const {data, searchField, searchedData} = this.state;
    if (value.id === 'random') {
      this.setState({visible: true});
    }
    if (value.id !== 'random') {
      selected.push(value);
      this.setState({data: data.filter(item => item !== value)});
      this.setState({
        searchedData: searchedData.filter(item => item !== value),
      });
    }
  }

  deleteSelection(item) {
    if (item.id.includes('custom')) {
      const a = selected.indexOf(item);
      selected.splice(a, 1);
      this.setState({});
    }

    if (item.id.includes('custom') === false) {
      const {data, searchedData} = this.state;
      const index = selected.indexOf(item);
      selected.splice(index, 1);
      this.setState({data: data.concat(item)});
      this.setState({searchedData: searchedData.concat(item)});
      // console.log(item);
    }
  }

  handleSearch(text) {
    const {data} = this.state;
    this.setState({searchField: text});
    const search = [];
    // console.log(text);
    const regexp1 = new RegExp(`${text}`, 'gi');
    data.forEach(e => {
      if (regexp1.test(e.name) === true) {
        search.push(e);
      }
    });
    // this.setState({ searchedData: search });
    this.setState({searchedData: search});
  }

  hideModal() {
    this.setState({visible: false});
  }

  customSkill() {
    if (selected.length >= 5) {
      alert('please enter 5');
    }
    const {customskillset} = this.state;
    console.log(this.state.data);
    const x = Math.floor(Math.random() * 10 + Math.random() * 10);
    selected.push({name: customskillset, id: `custom${x}`});
    this.setState({visible: false});
  }

  render() {
    const {searchField, searchedData, data, visible,lan} = this.state;
    const {loading} = this.state;
    return (
      <ScrollView
        scrollEnabled={false}
        contentContainerStyle={{height, marginTop: 20}}>
        <Portal>
          <Modal visible={loading} dismissable={false}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator color="#fb0201" size="large" />
            </View>
          </Modal>
        </Portal>
        <Portal>
          <Modal visible={visible} onDismiss={this.hideModal}>
            <View style={styles.modalStyle}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Image
                  source={require('../images/woodlig-logo-alt-image.png')}
                  style={styles.logoStyle}
                />
                <TouchableOpacity onPress={this.hideModal}>
                  <Customon name="x-endgame" color="black" />
                </TouchableOpacity>
              </View>
              <View style={{alignItems: 'center'}}>
                <TextView
                  style={{color: 'black', fontSize: 20, fontWeight: 'bold'}} text='Add Skill'>

                </TextView>
              </View>
              <View>
                <TextInput
                  onChangeText={customskillset =>
                    this.setState({customskillset})
                  }
                  placeholder="Ex. Actor"
                  style={styles.modalInput}
                />
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={this.customSkill}>
                  <TextView style={{fontSize: 15, color: 'white'}} text='ENTER'></TextView>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Portal>
        <View style={{flex: 1}}>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <View
            style={{
              flex: 1.5,
              justifyContent: 'space-evenly',
              alignItems: 'center',
              elevation: 5,
              backgroundColor: 'white',
            }}>
            <TextView style={{fontSize: 20, color: 'black'}} text='Setup'></TextView>
            <TextView style={{fontSize: 20, color: 'black', fontWeight: 'bold'}} text='Tell Us About Your Business'>

            </TextView>
            <TextView style={{fontSize: 15, color: 'black'}} text='(You may pick multiple options)'>

            </TextView>
            <View style={styles.inputStyle}>
              <TextInput
                placeholder={language.promotions.search_skill(lan)}
                placeholderTextColor="black"
                onChangeText={this.handleSearch.bind(this)}
                style={{width: width - 100, paddingLeft: 10}}
              />
              <Icon
                name="search"
                size={20}
                color="black"
                style={{alignSelf: 'center', paddingHorizontal: 20}}
              />
            </View>
            <View style={styles.hrStyle} />
          </View>
          <View style={{flex: 3}}>
            <FlatList
              data={
                searchField === ''
                  ? data.concat({
                      name: "Can't find your skill? Click here",
                      id: 'random',
                    })
                  : searchedData.concat({
                      name: "Can't find your skill? Click here",
                      id: 'random',
                    })
              }
              refreshing
              initialNumToRender={2}
              removeClippedSubviews
              contentContainerStyle={{marginTop: 10}}
              keyExtractor={item => item.id}
              onViewableItemsChanged={this.onViewableItemsChanged}
              viewabilityConfig={{
                itemVisiblePercentThreshold: 50,
              }}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={this.roleSelected.bind(this, item)}
                  style={styles.contentStyle}>
                  <Text
                    style={[
                      styles.textContent,
                      {
                        color: item.id === 'random' ? 'red' : 'black',
                        textDecorationLine:
                          item.id === 'random' ? 'underline' : 'none',
                        textTransform:
                          item.id === 'random' ? 'none' : 'capitalize',
                      },
                    ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
          <View style={styles.bottomContainer}>
            <View style={{flex: 1}}>
              <View style={{marginLeft: 20, marginHorizontal: 10}}>
                <TextView style={{marginRight:5}} text={`skills selected (${selected.length})`}></TextView>
              </View>
              <ScrollView horizontal contentContainerStyle={{height: 40}}>
                {selected.map(e => (
                  <TouchableOpacity
                    key={e.id}
                    style={styles.selectedContainer}
                    onPress={this.deleteSelection.bind(this, e)}>
                    <Text style={styles.selectedText}>{e.name}</Text>
                    <Icon
                      name="times"
                      color="red"
                      size={20}
                      style={{alignSelf: 'center'}}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={{flex: 1.5}}>
              <View style={[styles.hrStyle, {alignSelf: 'center'}]} />
              <View style={{position: 'absolute', right: 0, bottom: 60}}>
                <TouchableOpacity
                  onPress={this.onDone}
                  style={styles.nextButton}>
                  <Text style={{color: 'white'}}>
                    {selected.length !== 0 ? 'NEXT ' : 'SKIP '}
                  </Text>
                  <Customon name="long-arrow-right" color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  inputStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderWidth: 1,
    backgroundColor: 'white',
    width: width - 50,
    height: 40,
    elevation: 5,
  },
  hrStyle: {
    backgroundColor: '#dedede',
    height: 2,
    width: 100,
  },
  bottomContainer: {
    flex: 1.5,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // borderWidth: 1,
    // paddingTop: 10,
    elevation: 10,
  },
  contentStyle: {
    backgroundColor: 'white',
    marginBottom: 20,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    elevation: 1,
  },
  textContent: {
    textTransform: 'capitalize',
    color: 'black',
    fontSize: 17,
  },
  selectedText: {
    color: 'red',
    fontSize: 20,
    textTransform: 'capitalize',
    paddingRight: 20,
  },
  selectedContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 20,
    height: 30,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  modalStyle: {
    width: 327,
    height: 257,
    borderTopLeftRadius: 52,
    borderTopRightRadius: 52,
    borderBottomLeftRadius: 52,
    backgroundColor: 'white',
    alignSelf: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  logoStyle: {
    height: 18,
    width: 88,
  },
  modalInput: {
    width: 286,
    height: 52,
    borderWidth: 1,
    borderColor: '#e7e4e9',
  },
  modalButton: {
    borderRadius: 52,
    height: 44,
    width: 96,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    backgroundColor: 'red',
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
  },
});

const mapStateToProps = state => ({
  formdata: state.individualform.businessData,
  user_id: state.userid.id,
});

export default connect(
  mapStateToProps,
  {individualSentData},
)(withNavigation(BusinessChooseSkill));
