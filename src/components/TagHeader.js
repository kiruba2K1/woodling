import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { withNavigation } from 'react-navigation';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../config.json';
const Customon = createIconSetFromFontello(fontelloConfig);

const { width, height } = Dimensions.get('window');

class TagHeader extends Component {
    componentDidMount() {
        console.warn(this.props.navigation);
    }
    render() {
        const { navigation, searchField, item } = this.props;
        // const actualroute = navigation.state.routes.find(route => route.routeName === "SearchFilterScreen");
        return (
            <View style={styles.headerRoot}>
                <View style={{ height: 41, backgroundColor: '#fff' }} />
                <View style={styles.containerContainer}>
                    <View style={styles.inputContainer}>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity onPress={() => navigation.goBack(null)}>
                                <Customon name="long-arrow-left" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 5, justifyContent: 'center' }}>
                            <TouchableOpacity style={{ flex: 1, justifyContent: 'center' }} onPress={() => navigation.navigate('SearchScreen')}>
                                <Text>{searchField}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity>
                                <Customon name="search" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#ff9c9b', '#fbaead']} style={styles.labelButton}>
                        <Text style={styles.buttonTextStyle}>#{item.title}</Text>
                    </LinearGradient>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerRoot: {
        backgroundColor: '#fff',
        height: 136,
        width,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    buttonContainer: {
        height: 54,
        width,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    labelButton: {
        height: 30,
        paddingHorizontal: 3,
        shadowColor: 'rgba(0, 0, 0, 0.39)',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 2,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonTextStyle: {
        color: '#1c1c1c',
        fontFamily: 'Poppins',
        fontSize: 13,
        textTransform: 'capitalize'
    },
    containerContainer: { height: 41, alignItems: 'center', justifyContent: 'center' },
    inputContainer: {
        backgroundColor: '#fff',
        elevation: 10,
        flexDirection: 'row',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '95%',
        height: '95%',
        justifyContent: 'space-between'
    },
    iconContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default withNavigation(TagHeader);