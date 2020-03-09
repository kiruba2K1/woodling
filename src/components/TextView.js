import React, {Component} from 'react';
import {View, Text, AsyncStorage} from 'react-native';
import { PowerTranslator,
   ProviderTypes,
   TranslatorConfiguration,
   TranslatorFactory } from 'react-native-power-translator';

export default class TextView extends Component {

  componentDidMount(){
    this._retrieveData();
      // console.log("--------- TestData : ",this.state.isFrench);
    // if(this.state.isFrench){
    //   TranslatorConfiguration.setConfig(ProviderTypes.Google, 'AIzaSyB4IiebZ2y0IKH8JhxTI7HJeI8t2FO1iIA','fr', 'en');
    // }else{
    //   TranslatorConfiguration.setConfig(ProviderTypes.Google, 'AIzaSyB4IiebZ2y0IKH8JhxTI7HJeI8t2FO1iIA','en', 'en');
    // }
    // const translator = TranslatorFactory.createTranslator();
    // const {text} = this.props;
    //
    // if(translator != undefined){
    //   translator.translate(text).then(translated => {
    //     this.setState({text:translated});
    //   });
    // }
  }
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('lan');
      if (value !== null) {
        // We have data!!
        console.log(value);
        //alert(value);
        if(value == 'fr'){
          TranslatorConfiguration.setConfig(ProviderTypes.Google, 'AIzaSyB4IiebZ2y0IKH8JhxTI7HJeI8t2FO1iIA','fr', 'en');
          const translator = TranslatorFactory.createTranslator();
          const {text} = this.props;

          if(translator != undefined){
            translator.translate(text).then(translated => {
              this.setState({text:translated});
            });
          }
        }else{
          // TranslatorConfiguration.setConfig(ProviderTypes.Google, 'AIzaSyB4IiebZ2y0IKH8JhxTI7HJeI8t2FO1iIA','en', 'en');
          // const translator = TranslatorFactory.createTranslator();
          const {text} = this.props;
          this.setState({text});

          // if(translator != undefined){
          //   translator.translate(text).then(translated => {
          //     this.setState({text:translated});
          //   });
          // }
        }
      }else{
        console.log("--------- Else");
        //alert(value);
      }
    } catch (error) {
      //alert("error");
      console.log("--------- Error",error);
      // Error retrieving data
    }
  };

  state={
    text:"",
  }

  render() {
    const {text} = this.state;
    const {style} = this.props;
    return (
      <Text style={style}>{text}</Text>
      );
  }
}
