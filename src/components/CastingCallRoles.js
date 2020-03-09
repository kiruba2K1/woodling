/* eslint-disable react/prefer-stateless-function */
import React, {Component} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Picker,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {connect} from 'react-redux';
import axios from 'axios';
import {castingCallRolesItems} from '../redux/actions/postajob';
import {apiurl} from '../constants/config';
import TextView from './TextView';

class CastingCallRoles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderpoints: [22, 37],
      gender: 'Any/All',
      iconpress: false,
      role_description: '',
      roles: [],
      selectedrole: '1',
    };
  }

  componentDidMount() {
    const {
      age_from,
      age_to,
      role_description,
      gender,
      role_type_id,
    } = this.props;
    // console.warn(role_description);
    axios.get(`${apiurl}fetch-role-type.php`).then(res => {
      this.loadData(age_from, age_to, role_description, gender, role_type_id);
      // const roles = res.data.data;
      // roles.splice(0, 0, {name: 'N/A', id: 'N/A'});
      // console.warn(roles);
      this.setState({roles: res.data});
    });
  }

  componentDidUpdate() {
    const {
      sliderpoints,
      gender,
      role_description,
      selectedrole,
      role_type_text,
    } = this.state;
    const {datum, index} = this.props;
    const total = {
      age_from: sliderpoints[0],
      age_to: sliderpoints[1],
      gender,
      role_description,
      role_type_id: selectedrole === 'other' ? role_type_text : selectedrole,
    };
    // console.warn(total);
    datum(total, index);
    this.props.castingCallRolesItems(total);
    // console.log(total)
  }

  loadData = (age_from, age_to, role_description, gender, role_type_id) => {
    // console.warn(age_from, age_to, role_description, gender, role_type_id);
    if (age_from || age_to || role_description || gender) {
      this.setState({
        role_description,
        sliderpoints: [parseInt(`${age_from}`), parseInt(`${age_to}`)],
        gender,
        selectedrole: role_type_id,
      });
    }
  };

  render() {
    const {index, deleteRole} = this.props;
    const {
      sliderpoints,
      gender,
      role_description,
      roles,
      selectedrole,
      role_type_text,
    } = this.state;
    return (
      <View style={{paddingTop: 20}}>
        <View style={{marginTop: 10, height: 1, backgroundColor: '#dedede'}} />
        <View style={{marginBottom: 20}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TextView style={styles.titlestyle} text='Role Type'></TextView>
            {index !== 0 && (
              <TouchableOpacity onPress={() => deleteRole(index)}>
                <TextView style={{color: 'red'}} text='Remove'></TextView>
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 20,
              borderColor: '#dedede',
              // height: 23,
              width: 150,
            }}>
            {roles.data !== undefined && (
              <Picker
                selectedValue={selectedrole}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({selectedrole: itemValue})
                }
                itemStyle={{height: 150}}
                style={{width: 150}}>
                {roles.data.concat({name: 'other', id: 'other'}).map(e => (
                  <Picker.Item
                    key={e.id}
                    label={e.name}
                    value={e.id}
                    style={{fontSize: 10, fontFamily: 'Poppins-Medium'}}
                  />
                ))}
              </Picker>
            )}
          </View>
          {selectedrole === 'other' && (
            <View style={{paddingVertical: 20}}>
              <TextInput
                style={{borderBottomWidth: 1}}
                placeholder="Add another role"
                value={role_type_text}
                onChangeText={role_type_text => this.setState({role_type_text})}
              />
            </View>
          )}
        </View>
        <View>
          <TextView style={styles.titlestyle} text='Role Description'></TextView>
          <TextInput
            style={{
              height: 60,
              borderWidth: 1,
              padding: 8,
              width: '90%',
              borderColor: '#dedede',
              textAlignVertical: 'top',
            }}
            placeholder="Write here"
            value={role_description}
            onChangeText={role_description => this.setState({role_description})}
          />
        </View>
        <View style={{marginTop: 10}}>
          <TextView style={styles.titlestyle} text='Gender'></TextView>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              onPress={() => this.setState({gender: 'Any/All'})}>
              <TextView
                style={[
                  styles.gendertext,
                  {color: gender === 'Any/All' ? 'red' : 'black'},
                ]} text='Any/All'>

              </TextView>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({gender: 'Female'})}>
              <TextView
                style={[
                  styles.gendertext,
                  {color: gender === 'Female' ? 'red' : 'black'},
                ]} text='Female'>

              </TextView>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({gender: 'Male'})}>
              <TextView
                style={[
                  styles.gendertext,
                  {color: gender === 'Male' ? 'red' : 'black'},
                ]} text='Male'>

              </TextView>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({gender: 'Non-binary'})}>
              <TextView
                style={[
                  styles.gendertext,
                  {color: gender === 'Non-binary' ? 'red' : 'black'},
                ]} text='Non-binary'>

              </TextView>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({gender: 'Transgender'})}>
              <TextView
                style={[
                  styles.gendertext,
                  {color: gender === 'Transgender' ? 'red' : 'black'},
                ]} text='Transgender'>

              </TextView>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({gender: 'GenderFluid'})}>
              <TextView
                style={[
                  styles.gendertext,
                  {color: gender === 'GenderFluid' ? 'red' : 'black'},
                ]} text='GenderFluid'>

              </TextView>
            </TouchableOpacity>
          </View>
          <View style={{paddingTop: 20}}>
            <TextView style={styles.titlestyle} text='Age Range'></TextView>
            <View
              style={{
                paddingTop: 10,
                flexDirection: 'row',
                flexWrap: 'nowrap',
                width: '100%',
                marginHorizontal: 'auto',
              }}>
              <Text style={{textAlignVertical: 'center'}}>0</Text>
              <MultiSlider
                isMarkersSeparated
                snapped
                customMarkerLeft={() => (
                  <View>
                    <Text style={{position: 'absolute', bottom: 20}}>
                      {sliderpoints[0]}
                    </Text>
                    <Icon
                      name="circle"
                      size={20}
                      color="red"
                      style={{backgroundColor: '#f1f1f1'}}
                    />
                  </View>
                )}
                customMarkerRight={() => (
                  <View>
                    <Text style={{position: 'absolute', bottom: 20}}>
                      {sliderpoints[1]}
                    </Text>
                    <Icon
                      name="circle"
                      size={20}
                      color="red"
                      style={{backgroundColor: '#f1f1f1'}}
                    />
                  </View>
                )}
                values={sliderpoints}
                onValuesChange={e => this.setState({sliderpoints: e})}
                minMarkerOverlapDistance={10}
                min={0}
                max={100}
                selectedStyle={{backgroundColor: 'red', height: 3}}
                markerStyle={{
                  backgroundColor: 'white',
                  borderColor: 'red',
                  borderWidth: 2,
                }}
              />
              <Text style={{textAlignVertical: 'center'}}>100+</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titlestyle: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#414141',
    marginBottom: 10,
  },
  gendertext: {
    fontSize: 10,
  },
});

export default connect(null, {castingCallRolesItems})(CastingCallRoles);
