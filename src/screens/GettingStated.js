import React, { Component } from "react"
import { View, Image, TouchableOpacity, Text, ImageBackground, } from "react-native"
import * as Animatable from 'react-native-animatable';
import { ScrollView } from "react-native-gesture-handler";
import TextView from '../components/TextView';

class GettingStated extends Component {
    state = {}
    render() {
        return (
            <ScrollView style={{flex:1}}>
            <View style={{flex:1,alignItems:"center",paddingBottom:20}}>
            <ImageBackground source={require("../images/Mask_Group.png")} imageStyle={{ resizeMode: "stretch" }} style={{ flex: 1,paddingTop:"7%" }}>
                <View style={{ flexDirection: "row", justifyContent: "flex-end",flex:1 }}>
                    <Animatable.View useNativeDriver animation="slideInDown" style={{ marginTop: "8%", left: -5, }}>
                        <TextView style={{ fontSize: 19, fontFamily: "Poppins-Medium", fontWeight: "bold", color: "#fff" }} text={"Great! You have made it\nWe Are Now Completing Setup"} />
                    </Animatable.View>
                    <Animatable.View useNativeDriver animation="slideInRight" style={{ resizeMode: "contain", marginStart: 10, right:0,marginTop:"2%" }}>
                        <Image style={{ resizeMode: "contain",width:70,height:70 }} source={require("../images/thumb-up-welldone.png")} />
                    </Animatable.View>
                </View>

                <View style={{marginTop:"20%",alignItems:"center" }}>
                    <Animatable.View useNativeDriver animation="slideInLeft" style={{ resizeMode: "contain", marginEnd: "20%"}}>
                        <Image style={{ resizeMode: "contain" }} source={require("../images/Rectangle_877.png")} />
                    </Animatable.View>
                    <TextView style={{color:"#000",fontSize:25,marginVertical:7}} text='Welcome to' />
                      <Animatable.View useNativeDriver animation="slideInRight" style={{ resizeMode: "contain", marginStart: "20%"}}>
                        <Image style={{ resizeMode: "contain" }} source={require("../images/Rectangle_878.png")} />
                    </Animatable.View>
                    <Image source={require("../images/Woodlig_new_logo.png")} style={{marginVertical:5,marginLeft:"22%",resizeMode:"stretch",width:120,height:30}}/>
                    <View>
                    <Image source={require("../images/target-arrow-inverted.png")} style={{marginVertical:5,resizeMode:"contain",width:200,height:150,marginEnd:20}}/>
                </View>
                <View style={{backgroundColor:"#e4e4e4",width:"80%",height:5,marginVertical:10}}/>
                <TextView style={{color:"red",marginHorizontal:10,textAlign:"center",fontWeight:"bold"}}
                text={`The comprehensive woodlig user terms ("Terms") comprises of the Terms of Service, User Permissions, Privacy Policy, Woodlig Rules as well as all Incorporated Policies.These terms administrate over your use of Woodlig and the products, features, app, services, technologies and software that we offer (Woodlig Products). Except where we expressly state that different Terms (and not these) apply.`} />
                <TextView style={{color:"red",marginHorizontal:10,marginVertical:10,textAlign:"center",fontWeight:"bold"}}
                text='Please note that when you use Woodlig Products you agree all of these terms' />
                </View>
            </ImageBackground>
            <TouchableOpacity
              onPress={()=>this.props.navigation.navigate("ActivityStream")} style={{borderColor:"red",borderWidth:3,borderRadius:50,width:130,height:40,marginTop:10,alignItems:"center",justifyContent:"center"}}>
                <TextView style={{ fontSize: 19, fontWeight: "bold", color: "red" }} text='Get Started' />
                </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}

export default GettingStated;
