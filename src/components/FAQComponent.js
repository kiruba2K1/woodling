import React, { Component } from 'react'
import { View, Text, TouchableOpacity, LayoutAnimation, UIManager, Platform } from "react-native"

export default class FaqComponent extends Component {

    state = {
        maxHeight: 0,
        minHeight: 0,
        expand: false,
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    changeLayout = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        this.setState({ expand: !this.state.expand });
    }

    render() {
        var { title, children } = this.props;
        return (
            <View style={{ margin: 10, backgroundColor: "#fff", padding: 20, borderRadius: 8, overflow: "hidden",elevation:10 }}>
                <TouchableOpacity
                    onPress={this.changeLayout}
                //  onPress={this.showContent}
                >
                    <Text style={{ fontWeight: "bold", fontSize: 17, color:this.state.expand?"red":"#4c4c4c" }}>{title}</Text>

                </TouchableOpacity>
                {
                    this.state.expand ?
                        <View
                            style={{ marginTop: 10 }}
                        >
                            {
                                children
                            }
                        </View> : null
                }



            </View>
        )
    }
}
