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
import { Switch, List } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { general, security, privacyFAQ, legal } from '../constants/config.js';
import { FlatList } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import { MenuOptions, MenuOption, MenuTrigger, Menu, MenuProvider } from 'react-native-popup-menu';
import * as Animatable from 'react-native-animatable';
import FaqComponent from '../components/FAQComponent.js';
import TextView from '../components/TextView';

const Customon = createIconSetFromFontello(fontelloConfig);

export default class FAQ extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: general,
            type: "general",
            menu: false
        }
    }

    getHeaderText = () => {
        var { type } = this.state;
        if (type == "general") {
            return "General"
        }
        else if (type == "security") {
            return "Security"
        }
        else if (type == "privacy") {
            return "Privacy"
        }
        else if (type == "legal") {
            return "Legal"
        }
    }

    ChangeContent = (type) => {
        var data=[]
        if (type == "general") {
            data=general;
        }
        else if (type == "security") {
            data=security;
        }
        else if (type == "privacyFAQ") {
            data=privacyFAQ;
        }
        else if (type == "legal") {
            data=legal;
        }
        this.setState({ data:data,type: type, menu: false })

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
                            <Text style={styles.title}>FAQ - {this.getHeaderText()}</Text>
                        </View>

                        <Menu
                            onOpen={() => {
                                this.setState({ menu: true })
                            }}
                            onBackdropPress={() => {
                                this.setState({ menu: false })
                            }}
                        >
                            <MenuTrigger
                            >
                                {this.state.menu ?
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
                                optionsContainerStyle={{ height: "90%", width: "80%", borderBottomLeftRadius: 50, borderTopLeftRadius: 50, marginTop: 40, marginLeft: "5%" }}
                            >
                                <MenuOption style={{ alignItems: "flex-end" }}>
                                    <View style={{ padding: 10 }}>
                                        <Image style={{ width: 120, height: 40, resizeMode: "contain" }} source={require('../images/Woodlig_logo.png')} />
                                    </View>
                                </MenuOption>
                                <MenuOption
                                    onSelect={() => this.ChangeContent("general")}
                                    style={{ borderBottomColor: "#ccc", borderTopColor: "#ccc", borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: 10, paddingHorizontal: 15 }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        {this.state.type == "general" ?
                                            <View style={{ backgroundColor: "red", borderRadius: 50, height: 10, width: 10, marginEnd: 10 }} />
                                            : null
                                        }
                                        <TextView style={[{ fontFamily: 'Poppins-Medium', fontSize: 15, color: '#000' }, this.state.type == "general" ? { fontWeight: "bold", fontSize: 16 } : { marginStart: 20 }]} text='General' />
                                    </View>
                                </MenuOption>
                                <MenuOption
                                    onSelect={() => this.ChangeContent("security")}
                                    style={{ borderBottomColor: "#ccc", borderBottomWidth: 1, paddingVertical: 10, paddingHorizontal: 15 }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        {this.state.type == "security" ?
                                            <View style={{ backgroundColor: "red", borderRadius: 50, height: 10, width: 10, marginEnd: 10 }} />
                                            : null
                                        }
                                        <TextView style={[{ fontFamily: 'Poppins-Medium', fontSize: 15, color: '#000' }, this.state.type == "security" ? { fontWeight: "bold" } : { marginStart: 20 }]} text='Security' />
                                    </View>
                                </MenuOption>
                                <MenuOption
                                    onSelect={() => this.ChangeContent("privacyFAQ")}
                                    style={{ borderBottomColor: "#ccc", borderBottomWidth: 1, paddingVertical: 10, paddingHorizontal: 15 }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        {this.state.type == "privacyFAQ" ?
                                            <View style={{ backgroundColor: "red", borderRadius: 50, height: 10, width: 10, marginEnd: 10 }} />
                                            : null
                                        }
                                        <TextView style={[{ fontFamily: 'Poppins-Medium', fontSize: 15, color: '#000' }, this.state.type == "privacyFAQ" ? { fontWeight: "bold" } : { marginStart: 20 }]} text='Privacy' />
                                    </View>
                                </MenuOption>
                                <MenuOption
                                    onSelect={() => this.ChangeContent("legal")}
                                    style={{ borderBottomColor: "#ccc", borderBottomWidth: 1, paddingVertical: 10, paddingHorizontal: 15 }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        {this.state.type == "legal" ?
                                            <View style={{ backgroundColor: "red", borderRadius: 50, height: 10, width: 10, marginEnd: 10 }} />
                                            : null
                                        }
                                        <TextView style={[{ fontFamily: 'Poppins-Medium', fontSize: 15, color: '#000' }, this.state.type == "legal" ? { fontWeight: "bold" } : { marginStart: 20 }]} text='Legal' />
                                    </View>
                                </MenuOption>
                                <MenuOption style={{}}>
                                    <View style={{ paddingStart: 20, marginTop: "10%" }}>
                                        <Image style={{ width: 60, height: 20, resizeMode: "contain" }} source={require('../images/woodlig-logo-alt-image.png')} />
                                    </View>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </View>
                    <ScrollView style={{flex:1}}>
                    <View style={{ flex: 1, marginBottom: 50}}>
                        {
                            this.state.data.map(value => {
                                return (
                                    <FaqComponent title={value.title}>
                                     <Text style={{color:"#4c4c4c"}}>
                                                {value.content}
                                            </Text>
                                </FaqComponent>
                                )
                            })
                        }

                    </View>
                    </ScrollView>
                </View>

            </MenuProvider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
