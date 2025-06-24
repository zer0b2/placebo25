<template>
    <v-dialog
        v-model="show"
        width="500">
        <v-card>
            <v-card-title
                class="headline"
                v-t="$t('smart_captcha_keys.dialogs.delete.title')"
                primary-title />

            <v-card-text v-t="{
                path: 'smart_captcha_keys.dialogs.delete.warning',
                args: { id: id }
            }" />

            <v-divider />

            <v-card-actions>
                <v-spacer />

                <v-btn
                    text
                    v-t="$t('smart_captcha_keys.buttons.cancel')"
                    @click="closeHandler" />

                <v-btn
                    color="warning"
                    text
                    v-t="$t('smart_captcha_keys.buttons.delete')"
                    @click="applyHandler" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['show', 'id', 'closeHandler', 'applyHandler'],
};
</script>

