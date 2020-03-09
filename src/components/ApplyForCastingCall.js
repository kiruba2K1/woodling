import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Portal, Modal, Button} from 'react-native-paper';
import {Header} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import {connect} from 'react-redux';
import {apiurl, localurl} from '../constants/config';
import TextView from './TextView';

const {width, height} = Dimensions.get('window');

class ApplyForCastingCall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      role: '',
      loading: false,
      applied: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.hide2Modal = this.hide2Modal.bind(this);
  }

  componentDidMount() {
    const {detail, casting_call, user_id} = this.props;
    console.warn(detail.application_id);
    if (detail.application_id === null) {
      this.setState({applied: false});
    }
    if (detail.application_id !== null) {
      this.setState({applied: true});
    }
  }

  showModal() {
    const {detail} = this.props;
    this.setState({
      visible: true,
    });
    // console.log(e);
  }

  hideModal() {
    this.setState({visible: false});
  }

  async handleSubmit() {
    this.setState({loading: true});
    const {detail, casting_call, user_id} = this.props;
    const casting_call_id = casting_call.id;
    const role_id = casting_call.skill_id;
    const {role_type_id} = detail;
    const total = {user_id, role_id, role_type_id, casting_call_id};
    await axios
      .post(`${apiurl}apply-for-casting-call.php`, total)
      .then(res => {
        // console.warn(total);
        if (res.data.status === 'success') {
          this.setState({applied: true, visible: false});
        }
      })
      .catch(res => alert('network error'));
    this.setState({loading: false});
  }

  show2Modal() {
    const {detail} = this.props;
    this.setState({
      visible2: true,
    });
    // console.log(e);
  }

  hide2Modal() {
    this.setState({visible2: false});
  }

  async cancelSubmission() {
    this.setState({loading: true});
    const {detail, casting_call, user_id} = this.props;
    const casting_call_id = casting_call.id;
    const role_id = casting_call.skill_id;
    const {role_type_id} = detail;
    const total = {user_id, role_id, role_type_id, casting_call_id};
    console.warn(total);
    await axios
      .post(`${apiurl}cancel-casting-call-application.php`, total)
      .then(res => {
        // console.warn(res.data);
        if (res.data.status === 'success') {
          this.setState({applied: false, visible2: false});
        }
      })
      .catch(res => console.log(res.data));
    this.setState({loading: false});
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    const {visible, visible2, role, loading, applied} = this.state;
    const {casting_call, detail, index, user_id} = this.props;
    return (
      <View style={{backgroundColor: '#eeeeee'}}>
        <StatusBar
          translucent
          backgroundColor="#ffffff"
          barStyle="dark-content"
        />
        <Portal>
          <Modal dismissable={false} visible={visible}>
            <View
              style={{
                borderTopLeftRadius: 70,
                borderTopRightRadius: 70,
                borderBottomLeftRadius: 70,
                alignSelf: 'center',
                justifyContent: 'space-around',
                height: 250,
                width: 327,
                backgroundColor: 'white',
              }}>
              <Image
                source={require('../images/ccillustration.png')}
                style={{alignSelf: 'center'}}
              />
              <TextView
                style={{textAlign: 'center', fontSize: 15, color: 'black'}}
                text="you have applied for the role of"></TextView>
              <Text style={{textAlign: 'center', fontSize: 20, color: 'black'}}>
                {casting_call.skill}, {detail.role_type}
              </Text>
              {loading === false ? (
                <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                  <TouchableOpacity
                    onPress={this.hideModal}
                    style={{
                      backgroundColor: '#f48282',
                      borderRadius: 30,
                      paddingHorizontal: 20,
                      paddingVertical: 8,
                    }}>
                    <TextView
                      style={{
                        color: 'white',
                        fontSize: 13,
                        fontWeight: 'bold',
                      }}
                      text="CANCEL"></TextView>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.handleSubmit}
                    style={{
                      backgroundColor: '#fb0201',
                      borderRadius: 30,
                      paddingHorizontal: 20,
                      paddingVertical: 8,
                      marginHorizontal: 15,
                    }}>
                    <TextView
                      style={{
                        color: 'white',
                        fontSize: 13,
                        fontWeight: 'bold',
                      }}
                      text="CONFIRM"></TextView>
                  </TouchableOpacity>
                </View>
              ) : (
                <ActivityIndicator />
              )}
            </View>
          </Modal>
          {/* modal for the deletion */}
          <Modal dismissable={false} visible={visible2}>
            <View
              style={{
                borderTopLeftRadius: 70,
                borderTopRightRadius: 70,
                borderBottomLeftRadius: 70,
                alignSelf: 'center',
                justifyContent: 'space-around',
                height: 250,
                width: 327,
                backgroundColor: 'white',
              }}>
              <Image
                source={require('../images/ccillustration.png')}
                style={{alignSelf: 'center'}}
              />
              <TextView
                style={{textAlign: 'center', fontSize: 15, color: 'black'}}
                text="you have opted to delete the role(s) of"></TextView>
              <Text style={{textAlign: 'center', fontSize: 20, color: 'black'}}>
                {casting_call.skill}, {detail.role_type}
              </Text>
              {loading === false ? (
                <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                  <TouchableOpacity
                    onPress={this.hide2Modal}
                    style={{
                      backgroundColor: '#f48282',
                      borderRadius: 30,
                      paddingHorizontal: 20,
                      paddingVertical: 8,
                    }}>
                    <TextView
                      style={{
                        color: 'white',
                        fontSize: 13,
                        fontWeight: 'bold',
                      }}
                      text="CANCEL"></TextView>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.cancelSubmission.bind(this)}
                    style={{
                      backgroundColor: '#fb0201',
                      borderRadius: 30,
                      paddingHorizontal: 20,
                      paddingVertical: 8,
                      marginHorizontal: 15,
                    }}>
                    <TextView
                      style={{
                        color: 'white',
                        fontSize: 13,
                        fontWeight: 'bold',
                      }}
                      text="CONFIRM"></TextView>
                  </TouchableOpacity>
                </View>
              ) : (
                <ActivityIndicator />
              )}
            </View>
          </Modal>
        </Portal>
        <View style={{marginTop: 10, backgroundColor: '#eeeeee'}}>
          <View
            style={{
              elevation: 3,
              backgroundColor: '#ffffff',
              marginBottom: 10,
              paddingVertical: 10,
            }}>
            <View
              style={{
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: '#dedede',
              }}>
              <TextView text={`ROLE(S): ${index + 1}`}></TextView>
            </View>
            <View style={{paddingHorizontal: 20}}>
              <View style={{paddingVertical: 10}}>
                <TextView text="Looking for:"></TextView>
                <Text style={{color: 'black', textTransform: 'capitalize'}}>
                  {casting_call.skill}
                </Text>
              </View>
              <View style={{paddingVertical: 10}}>
                <TextView text="Role type"></TextView>
                <Text style={{color: 'black'}}>{detail.role_type}</Text>
              </View>
              <View style={{paddingVertical: 10}}>
                <TextView text="Role description"></TextView>
                <Text style={{color: 'black'}}>{detail.role_description}</Text>
              </View>
              <View style={{paddingVertical: 10}}>
                <TextView text="Gender: "></TextView>
                <Text style={{color: 'black'}}>{detail.gender}</Text>
              </View>
              <View style={{paddingVertical: 10}}>
                <TextView text="Age Range: "> </TextView>
                <Text style={{color: 'black'}}>
                  {detail.age_from} - {detail.age_to}
                </Text>
              </View>
            </View>
            {casting_call.created_by !== user_id && (
              <View style={{paddingVertical: 20, alignItems: 'center'}}>
                {applied === false ? (
                  <TouchableOpacity
                    onPress={this.showModal.bind(this)}
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 3,
                      borderRadius: 10,
                      backgroundColor: '#f1f1f1',
                      elevation: 5,
                    }}>
                    <TextView style={{color: 'red'}} text="Apply"></TextView>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={this.show2Modal.bind(this)}
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 3,
                      borderRadius: 10,
                      backgroundColor: '#f1f1f1',
                      elevation: 5,
                    }}>
                    <TextView style={{color: 'red'}} text="CANCEL"></TextView>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
});

export default connect(mapStateToProps)(ApplyForCastingCall);
