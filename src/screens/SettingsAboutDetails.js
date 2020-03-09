import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    TextInput,
    Image,
    SectionList,
    ImageBackground
} from 'react-native';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { Dropdown } from 'react-native-material-dropdown';
import fontelloConfig from '../config.json';
import { Switch } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useragreement, terms, userpermissions, privacy, incorporated, usingWoolig } from '../constants/config.js';
import { FlatList } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import { MenuOptions, MenuOption, MenuTrigger, Menu, MenuProvider } from 'react-native-popup-menu';
import * as Animatable from 'react-native-animatable';
import TextView from '../components/TextView';

const Customon = createIconSetFromFontello(fontelloConfig);

export default class SettingsAboutDetails extends Component {
    constructor(props) {
        super(props)
        var { type } = this.props.navigation.state.params;
        var data = [];
        if (type == "terms") {
            data = terms
        }
        else if (type == "agreement") {
            data = useragreement
        }
        else if (type == "permissions") {
            data = userpermissions
        }
        else if (type == "privacy") {
            data = privacy
        }
        else if (type == "using") {
            data = usingWoolig
        }
        else if (type == "incorporated") {
            data = incorporated
        }
        this.state = {
            data: data,
            type:type,
            menu: false
        }
    }

    getHeaderText=()=>{
       var {type}= this.state;
        if (type == "terms") {
            return "Terms of Service"
        }
        else if (type == "agreement") {
            return "User Agreements"
        }
        else if (type == "permissions") {
            return "User Permissions"
        }
        else if (type == "privacy") {
            return "Privacy Policy"
        }
        else if (type == "using") {
           return "Using Woodlig"
        }
        else if (type == "incorporated") {
            return "Incorporated Policies"
        }
        else if (type == "release") {
            return "Release Notes"
        }
        else if (type == "open") {
            return "Open Source Libraries"
        }
    }

    ChangeContent=(type)=>{
        var data=[];
        if (type == "terms") {
            data=terms;
        }
        else if (type == "agreement") {
            data=useragreement
        }
        else if (type == "permissions") {
            data=userpermissions
        }
        else if (type == "privacy") {
            data=privacy
        }
        else if (type == "using") {
            data=usingWoolig
        }
        else if (type == "incorporated") {
            data=incorporated
        }
        else if (type == "release") {
            data=[]
        }
        else if (type == "open") {
            data=[]
        }
    this.setState({data:data,type:type,menu:false})

    }




    render() {
        return (
            <MenuProvider>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.headerArrow}>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.goBack()}
                            >
                                <Customon style={styles.arrowback} name="long-arrow-left" size={15} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.headerTitle}>
                            <TextView style={styles.title} text={this.getHeaderText()} />
                        </View>

                        <Menu
                        onOpen={()=>{
                            this.setState({menu:true})
                        }}
                        onBackdropPress={()=>{
                            this.setState({menu:false})
                        }}
                        >
                        <MenuTrigger
                        >
                        {this.state.menu?
                        <Animatable.View useNativeDriver>
                        <Icon name="close" type="material" />
                        </Animatable.View>
                        :
                         <Animatable.View useNativeDriver>
                        <Icon name="menu" type="material" />
                        </Animatable.View>
                        }
                        </MenuTrigger>
                        <MenuOptions
                        optionsContainerStyle={{height:"90%",width:"80%",borderBottomLeftRadius:50,borderTopLeftRadius:50,marginTop:40,marginLeft:"5%"}}
                        >
                        <MenuOption style={{alignItems:"flex-end"}}>
                        <View style={{padding:10}}>
                            <Image style={{width:120,height:40,resizeMode:"contain"}} source={require('../images/Woodlig_logo.png')} />
                            </View>
                        </MenuOption>
                            <MenuOption
                            onSelect={()=>this.ChangeContent("terms")}
                            style={{borderBottomColor:"#ccc",borderTopColor:"#ccc",borderTopWidth:1,borderBottomWidth:1,paddingVertical:10,paddingHorizontal:15}}
                            >
                            <View style={{flexDirection:"row",alignItems:"center"}}>
                            {this.state.type == "terms"?
                              <View style={{backgroundColor:"red",borderRadius:50,height:10,width:10,marginEnd:10}}/>
                              :null
                            }
                             <TextView style={[{fontFamily: 'Poppins-Medium', fontSize: 15, color: '#000'},this.state.type == "terms"?{fontWeight:"bold",fontSize:16}:{marginStart:20}]} text='Terms of Service' />
                            </View>
                            </MenuOption>
                            <MenuOption
                            onSelect={()=>this.ChangeContent("agreement")}
                            style={{borderBottomColor:"#ccc",borderBottomWidth:1,paddingVertical:10,paddingHorizontal:15}}
                             >
                             <View style={{flexDirection:"row",alignItems:"center"}}>
                            {this.state.type == "agreement"?
                              <View style={{backgroundColor:"red",borderRadius:50,height:10,width:10,marginEnd:10}}/>
                              :null
                            }
                            <TextView style={[{fontFamily: 'Poppins-Medium', fontSize: 15, color: '#000'},this.state.type == "agreement"?{fontWeight:"bold"}:{marginStart:20}]} text='User Agreements' />
                            </View>
                            </MenuOption>
                            <MenuOption
                            onSelect={()=>this.ChangeContent("permissions")}
                            style={{borderBottomColor:"#ccc",borderBottomWidth:1,paddingVertical:10,paddingHorizontal:15}}
                            >
                            <View style={{flexDirection:"row",alignItems:"center"}}>
                            {this.state.type == "permissions"?
                              <View style={{backgroundColor:"red",borderRadius:50,height:10,width:10,marginEnd:10}}/>
                              :null
                            }
                            <TextView style={[{fontFamily: 'Poppins-Medium', fontSize: 15, color: '#000'},this.state.type == "permissions"?{fontWeight:"bold"}:{marginStart:20}]} text='User Permissions' />
                            </View>
                            </MenuOption>
                            <MenuOption
                            onSelect={()=>this.ChangeContent("privacy")}
                            style={{borderBottomColor:"#ccc",borderBottomWidth:1,paddingVertical:10,paddingHorizontal:15}}
                            >
                            <View style={{flexDirection:"row",alignItems:"center"}}>
                            {this.state.type == "privacy"?
                              <View style={{backgroundColor:"red",borderRadius:50,height:10,width:10,marginEnd:10}}/>
                              :null
                            }
                            <TextView style={[{fontFamily: 'Poppins-Medium', fontSize: 15, color: '#000'},this.state.type == "privacy"?{fontWeight:"bold"}:{marginStart:20}]} text='Privacy Policy' />
                            </View>
                            </MenuOption>
                            <MenuOption
                            onSelect={()=>this.ChangeContent("using")}
                            style={{borderBottomColor:"#ccc",borderBottomWidth:1,paddingVertical:10,paddingHorizontal:15}}
                             >
                             <View style={{flexDirection:"row",alignItems:"center"}}>
                            {this.state.type == "using"?
                              <View style={{backgroundColor:"red",borderRadius:50,height:10,width:10,marginEnd:10}}/>
                              :null
                            }
      <Text style={[{fontFamily: 'Poppins-Medium', fontSize: 15, color: '#000'},this.state.type == "using"?{fontWeight:"bold"}:{marginStart:20}]}>Using Woodlig<Text style={{fontSize:8,textAlignVertical:"top"}}>TM</Text></Text>
                            </View>
                            </MenuOption>
                            <MenuOption
                            onSelect={()=>this.ChangeContent("incorporated")}
                            style={{borderBottomColor:"#ccc",borderBottomWidth:1,paddingVertical:10,paddingHorizontal:15}}
                            >
                            <View style={{flexDirection:"row",alignItems:"center"}}>
                            {this.state.type == "incorporated"?
                              <View style={{backgroundColor:"red",borderRadius:50,height:10,width:10,marginEnd:10}}/>
                              :null
                            }
                            <TextView style={[{fontFamily: 'Poppins-Medium', fontSize: 15, color: '#000'},this.state.type == "incorporated"?{fontWeight:"bold"}:{marginStart:20}]} text='Incorporated Policies' />
                            </View>
                            </MenuOption>
                            <MenuOption
                            onSelect={()=>this.ChangeContent("release")}
                            style={{borderBottomColor:"#ccc",borderBottomWidth:1,paddingVertical:10,paddingHorizontal:15}}
                            >
                            <View style={{flexDirection:"row",alignItems:"center"}}>
                            {this.state.type == "release"?
                              <View style={{backgroundColor:"red",borderRadius:50,height:10,width:10,marginEnd:10}}/>
                              :null
                            }
                                      <TextView style={[{fontFamily: 'Poppins-Medium', fontSize: 15, color: '#000'},this.state.type == "release"?{fontWeight:"bold"}:{marginStart:20}]} text='Release Notes' />
                            </View>
                            </MenuOption>
                            <MenuOption
                            onSelect={()=>this.ChangeContent("open")}
                            style={{borderBottomColor:"#ccc",borderBottomWidth:1,paddingVertical:10,paddingHorizontal:15}}
                            >
                            <View style={{flexDirection:"row",alignItems:"center"}}>
                            {this.state.type == "open"?
                              <View style={{backgroundColor:"red",borderRadius:50,height:10,width:10,marginEnd:10}}/>
                              :null
                            }
                                      <TextView style={[{fontFamily: 'Poppins-Medium', fontSize: 15, color: '#000'},this.state.type == "open"?{fontWeight:"bold"}:{marginStart:20}]} text='Open Source Libraries' />
                            </View>
                            </MenuOption>
                            <MenuOption>
                        <View style={{paddingStart:20,marginTop:"10%"}}>
                            <Image style={{width:60,height:20,resizeMode:"contain"}} source={require('../images/woodlig-logo-alt-image.png')} />
                            </View>
                        </MenuOption>
                        </MenuOptions>
                    </Menu>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                        <View style={{ alignItems: "center", justifyContent: "center", marginEnd: 5 }}>
                            <View style={{ elevation: 3, padding: 10, paddingTop: 15, borderRadius: 20, alignItems: "center", justifyContent: "center", marginStart: 5 }}>
                                {
                                    this.state.data.map((value, index, arr) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.sectionList.scrollToLocation({
                                                    sectionIndex: index,
                                                    itemIndex: 1
                                                })
                                            }}>
                                            <Text style={{ fontFamily: 'Poppins-Medium', borderRadius: 50, borderColor: "red", borderWidth: 2, textAlign: "center", width: 23, height: 23, textAlignVertical: "center", marginBottom: 10, color: "red" }}>{index + 1}</Text>
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                        </View>
                        <View style={{ flex: 1, marginBottom: 50 }}>
                            <SectionList
                                ref={(sectionList) => { this.sectionList = sectionList }}
                                keyExtractor={(index) => index}
                                renderItem={({ item }) => (
                                    <View style={{ flex: 1 }}>
                                        <TextView style={{ fontFamily: 'Poppins-Medium', color: "#000", marginVertical: 10, fontSize: 13 }} text={item.content ? item.content : item} />
                                        {
                                            item.subitems ?
                                                <SectionList
                                                    renderItem={({ item }) => (
                                                        <View style={{ flex: 1, marginHorizontal: 6 }}>
                                                            <TextView style={{ fontFamily: 'Poppins-Medium', color: "#000", marginVertical: 10, fontSize: 13 }} text={item} />
                                                        </View>
                                                    )}
                                                    keyExtractor={(index) => index}
                                                    renderSectionHeader={({ section: { title, index } }) => (
                                                        <ImageBackground style={{ flex: 1, height: 30, flexDirection: "row", alignItems: "center" }}>
                                                            <TextView numberOfLines={2} style={{ fontFamily: 'Poppins-Medium', flex: 1, color: "#aaa", fontSize: 15, fontWeight: "bold", marginHorizontal: 6 }} text={title} />
                                                        </ImageBackground>
                                                    )}
                                                    sections={item.subitems}
                                                />
                                                : null

                                        }
                                    </View>
                                )}
                                renderSectionHeader={({ section: { title, index } }) => (
                                    <ImageBackground source={require("../images/red-banner.png")} style={{ flex: 1, height: 50, flexDirection: "row", alignItems: "center" }}>
                                        <TextView numberOfLines={2} style={{ fontFamily: 'Poppins-Medium', flex: 1, color: "#fff", fontSize: 20, fontWeight: "bold", marginHorizontal: 6 }} text={title} />
                                        <Text style={{ fontFamily: 'Poppins-Medium', color: "#fff", fontSize: 40, fontWeight: "bold", marginEnd: 3 }}>{index + 1}</Text>
                                    </ImageBackground>
                                )}
                                sections={this.state.data}
                            />
                        </View>
                    </View>

                </View>

            </MenuProvider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eeeeee',
    },
    altLogo: {
        width: 44,
        height: 8,

    },
    logoText: {
        fontSize: 13,
        color: '#808080',
        fontFamily: 'Poppins-Medium',


    },
    logo: {
        flex: 2,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        justifyContent: 'center',
        alignItems: 'center'
    },

    header: {
        width: Dimensions.get('window').width,
        height: 60,
        backgroundColor: '#ffff',
        //  justifyContent: 'space-between',
        //alignItems: 'center',
        flexDirection: 'row',
        padding: 15,

        shadowOffset: { width: 3, height: 0 },
        elevation: 5,

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
        flex: 1,

    },

    headerTitle: {
        flex: 2,
        //marginLeft: 35,
        //alignItems: 'center',
        justifyContent: 'center',

    },
});
