<template>
    <v-dialog
        v-model="show"
        fullscreen
        transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="closeHandler">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>
                    <template v-if="isUpdateMode">
                        {{ $t('smart_captcha_keys.dialogs.update.title') }}
                    </template>
                    <template v-else>
                        {{ $t('smart_captcha_keys.dialogs.create.title') }}
                    </template>
                </v-toolbar-title>
            </v-toolbar>
            <v-card-text v-if="show">
                <v-container grid-list-md fluid>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-card>
                                <v-card-text>
                                    <v-layout row wrap>
                                        <v-flex v-if="isUpdateMode" xs3>
                                            <v-autocomplete v-model="captcha.attributes.color_schema"
                                                            :items="colorSchemes"
                                                            :placeholder="$t('smart_captcha_keys.dialogs.color_scheme')"
                                                            disabled />
                                        </v-flex>
                                        <v-flex v-else xs3>
                                            <v-autocomplete v-model="captcha.attributes.color_schema"
                                                            :items="colorSchemes"
                                                            :placeholder="$t('smart_captcha_keys.dialogs.color_scheme')" />
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field v-model="captcha.attributes.token_client"
                                                          :rules="rules"
                                                          :label="$t('smart_captcha_keys.dialogs.client_token')" />
                                        </v-flex>
                                        <v-flex xs3>
                                            <v-text-field v-model="captcha.attributes.token_secret"
                                                          :rules="rules"
                                                          :label="$t('smart_captcha_keys.dialogs.secret_token')" />
                                        </v-flex>
                                    </v-layout>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn
                    v-t="$t('smart_captcha_keys.buttons.cancel')"
                    color="blue darken-1"
                    text
                    @click="closeHandler" />
                <v-btn
                    color="blue darken-1"
                    @click="applyCaptcha">
                    <template v-if="isUpdateMode">
                        {{ $t('smart_captcha_keys.buttons.edit') }}
                    </template>
                    <template v-else>
                        {{ $t('smart_captcha_keys.buttons.create') }}
                    </template>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { smartCaptcha } from '../../../services/smartcaptcha';

export default {
    props: ['show', 'isUpdateMode', 'modelData', 'closeHandler', 'colorSchemes'],

    data() {
        return {
            captcha: { ...smartCaptcha.models.captcha() },
            rules: [(value) => (value || '').length <= 200 || this.$t('smart_captcha_keys.dialogs.token_limit')],
        };
    },

    mounted() {
        this.captcha = this.modelData;
    },

    methods: {
        applyCaptcha() {
            this.$emit('applyCaptcha', this.captcha);
        },
    },
};
</script>
