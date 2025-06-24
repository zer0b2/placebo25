<template>
    <v-layout wrap>
        <v-flex xs12>
            <v-card>
                <v-card-title>
                    <v-row no-gutters align="end">
                        <v-col class="col-12 col-md-8">
                            <span v-t="$t('smart_captcha_keys.title')" />
                            <v-btn
                                v-t="$t('smart_captcha_keys.buttons.add')"
                                color="success"
                                class="ml-5"
                                @click="modalModelCreate" />
                        </v-col>
                        <v-col class="col-12 col-md-4">
                            <v-text-field
                                append-icon="search"
                                :label="$t('smart_captcha_keys.search')"
                                single-line
                                hide-details />
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-data-table
                    :items="captchaArr"
                    :headers="headers"
                    :page="page"
                    :items-per-page="itemsPerPage"
                    :custom-filter="filter"
                    search="debouncedSearch"
                    :loading="debouncedSearch !== search"
                    :footer-props="{
                        'items-per-page-options': itemsPerPageOptions,
                    }"
                    @pagination="onPaginationUpdate">
                    <template #item="{ item }">
                        <tr :key="item.id">
                            <td>{{ item.id }}</td>
                            <td>{{ item.attributes.color_schema }}</td>
                            <td>{{ item.attributes.token_client }}</td>
                            <td>{{ item.attributes.token_secret }}</td>
                            <td class="justify-center px-0">
                                <v-tooltip bottom>
                                    <template #activator="{ on }">
                                        <v-icon small
                                                class="mr-2"
                                                @click="modelEdit(item)"
                                                v-on="on">
                                            <template>
                                                edit
                                            </template>
                                        </v-icon>
                                    </template>
                                    <span v-t="'smart_captcha_keys.buttons.edit'" />
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template #activator="{ on }">
                                        <v-icon
                                            small
                                            v-on="on"
                                            @click="modelDelete(item)">
                                            delete
                                        </v-icon>
                                    </template>
                                    <span v-t="'smart_captcha_keys.buttons.delete'" />
                                </v-tooltip>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </v-card>
        </v-flex>
        <v-update-dialog
            v-if="dialogs.updating.visible"
            :show="dialogs.updating.visible"
            :close-handler="() => closeDialog('updating')"
            :is-update-mode="dialogs.updating.update"
            :model-data="dialogs.updating.model"
            :color-schemes="colorSchemes"
            @applyCaptcha="applyModelUpdate" />

        <v-delete-dialog
            v-if="dialogs.deleting.visible"
            :id="dialogs.deleting.id"
            :show="dialogs.deleting.visible"
            :close-handler="() => closeDialog('deleting')"
            :apply-handler="applyModelDelete" />
    </v-layout>
</template>
<script src="./script.js"></script>
