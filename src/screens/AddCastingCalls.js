import React, {Component} from 'react';
import {
  Text,
  View,
  Picker,
  TextInput,
  StatusBar,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
import PostAJob from './PostAJob';
import MyPostedJobs from './MyPostedJobs.js';
import AppliedJobs from './AppliedJobs.js';
import CalendarView from './CalendarView';
import NoCastingCalls from './NoCastingCalls';
import TextView from '../components/TextView';

const Customon = createIconSetFromFontello(fontelloConfig);

const {height, width} = Dimensions.get('window');
// eslint-disable-next-line react/prefer-stateless-function
export default class AddCastingCalls extends Component {
  constructor(props) {
    super(props);
    this.state = {menustate: 'postajob'};
    this.onSuccess = this.onSuccess.bind(this);
  }

  componentDidMount() {
    const {navigation} = this.props;
    const menustatus = navigation.getParam('menustatus');
    this.setState({menustate: menustatus});
  }

  onSuccess(e) {
    this.setState({menustate: e});
  }

  render() {
    const {menustate} = this.state;
    return (
      <View style={{backgroundColor: '#eee'}}>
        <StatusBar
          translucent={false}
          backgroundColor="#fff"
          barStyle="dark-content"
        />
        <View
          style={{
            flexDirection: 'row',
            height: 60,
            width,
            backgroundColor: '#ffff',
            borderTopWidth: 0.5,
            borderTopColor: '#f1f1f1',
            elevation: 4,
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <View style={styles.menubutton}>
            <TouchableOpacity
              onPress={() => this.setState({menustate: 'postajob'})}
              style={{alignItems: 'center'}}>
              <Customon
                name="plus-circle"
                size={17.6}
                color={menustate === 'postajob' ? '#fb0201' : '#000'}
              />
              <TextView
                style={[
                  styles.menutext,
                  {color: menustate === 'postajob' ? 'red' : '#000'},
                ]}
                text="Post a Job"></TextView>
            </TouchableOpacity>
          </View>
          <View style={styles.menubutton}>
            <TouchableOpacity
              style={{alignItems: 'center'}}
              onPress={() => this.setState({menustate: 'mypostedjobs'})}>
              <Customon
                name="file-upload"
                size={17.8}
                color={menustate === 'mypostedjobs' ? '#fb0201' : '#000'}
              />
              <TextView
                style={[
                  styles.menutext,
                  {color: menustate === 'mypostedjobs' ? 'red' : '#000'},
                ]}
                text="My Posted Jobs"></TextView>
            </TouchableOpacity>
          </View>
          <View style={styles.menubutton}>
            <TouchableOpacity
              onPress={() => this.setState({menustate: 'appliedjobs'})}
              style={{alignItems: 'center'}}>
              <Customon
                name="paper-plane"
                size={16.4}
                color={menustate === 'appliedjobs' ? '#fb0201' : '#000'}
              />
              <TextView
                style={[
                  styles.menutext,
                  {color: menustate === 'appliedjobs' ? 'red' : '#000'},
                ]}
                text="My Submissions"></TextView>
            </TouchableOpacity>
          </View>
          <View style={styles.lastmenubutton}>
            <TouchableOpacity
              style={{alignItems: 'center'}}
              onPress={() => this.setState({menustate: 'calendarview'})}>
              <Customon
                name="calendar-star"
                size={17.6}
                color={menustate === 'calendarview' ? '#fb0201' : '#000'}
              />
              <TextView
                style={{
                  fontSize: 13,
                  color: menustate === 'calendarview' ? 'red' : '#000',
                }}
                text="Calendar View"></TextView>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{width}}>
          {menustate === 'postajob' && (
            <PostAJob routeOnSuccess={this.onSuccess} />
          )}

          {menustate === 'mypostedjobs' && <MyPostedJobs />}
          {menustate === 'appliedjobs' && <AppliedJobs />}
          {menustate === 'calendarview' && (
            <NoCastingCalls navigation={this.props.navigation} />
          )}
          {/* <View style={{ height: 200 }} /> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menutext: {
    fontSize: 9,
    fontFamily: 'Poppins-Medium',
  },
  menubutton: {flex: 1, alignItems: 'center'},
  lastmenubutton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 0.5,
    borderTopColor: '#f1f1f1',
    height: 60,
  },
  titlestyle: {
    fontSize: 20,
  },
});
