import {Button} from 'widget/button'
import {ButtonGroup} from 'widget/buttonGroup'
import {CenteredProgress} from 'widget/progress'
import {Consumer} from './recipeListContext'
import {Layout} from 'widget/layout'
import {Pageable} from 'widget/pageable/pageable'
import {ScrollableContainer, Unscrollable} from 'widget/scrollable'
import {SearchBox} from 'widget/searchBox'
import {SuperButton} from 'widget/superButton'
import {getRecipeType} from '../recipeTypes'
import {msg} from 'translate'
import Icon from 'widget/icon'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './recipeListData.module.css'

export class RecipeListData extends React.Component {
    render() {
        return (
            <Consumer>
                {({isLoading}) => {
                    return isLoading()
                        ? this.renderProgress()
                        : this.renderData()
                }}
            </Consumer>
        )
    }

    renderProgress() {
        return <CenteredProgress title={msg('process.recipe.loading')}/>
    }

    renderData() {
        return (
            <Consumer>
                {({hasData, highlightMatcher}) => {
                    return hasData()
                        ? (
                            <ScrollableContainer>
                                <Unscrollable>
                                    {this.renderSearchAndSort()}
                                </Unscrollable>
                                <Unscrollable className={styles.recipes}>
                                    <Pageable.Data
                                        itemKey={recipe => `${recipe.id}|${highlightMatcher}`}>
                                        {recipe => this.renderRecipe(recipe, highlightMatcher)}
                                    </Pageable.Data>
                                </Unscrollable>
                            </ScrollableContainer>
                        )
                        : null
                }}
            </Consumer>
        )
    }

    renderSearchAndSort() {
        return (
            <div className={styles.header}>
                <Layout type='horizontal' spacing='compact'>
                    {this.renderSearch()}
                    {this.renderSortButtons()}
                </Layout>
            </div>
        )
    }

    renderSearch() {
        return (
            <Consumer>
                {({setFilter}) => (
                    <SearchBox
                        placeholder={msg('process.menu.searchRecipes')}
                        onSearchValues={searchValues => setFilter(searchValues)}/>
                )}
            </Consumer>
        )
    }

    renderSortButtons() {
        return (
            <ButtonGroup layout='horizontal-nowrap-tight'>
                {this.renderSortButton('updateTime', msg('process.recipe.updateTime'))}
                {this.renderSortButton('name', msg('process.recipe.name'))}
            </ButtonGroup>
        )
    }

    renderSortButton(column, label) {
        return (
            <Consumer>
                {({sortingOrder, sortingDirection, setSorting}) => (
                    <Button
                        chromeless
                        look='transparent'
                        shape='pill'
                        size='large'
                        additionalClassName='itemType'
                        onClick={() => setSorting(column)}>
                        <span className={[styles.sortable, sortingOrder === column ? styles.sorted : null].join(' ')}>
                            {label}
                        </span>
                        <span className={styles.sortingHandle}>
                            {this.renderSortingHandle({column, sortingOrder, sortingDirection})}
                        </span>
                    </Button>
                )}
            </Consumer>
        )
    }

    renderSortingHandle({column, sortingOrder, sortingDirection}) {
        return sortingOrder === column
            ? sortingDirection === 1
                ? <Icon name={'sort-down'}/>
                : <Icon name={'sort-up'}/>
            : <Icon name={'sort'}/>
    }

    renderRecipe(recipe, highlightMatcher) {
        const {onSelect, onDuplicate, onRemove} = this.props
        return (
            <SuperButton
                key={recipe.id}
                title={this.getRecipeTypeName(recipe.type)}
                description={recipe.name}
                timestamp={recipe.updateTime}
                highlight={highlightMatcher}
                duplicateTooltip={msg('process.menu.duplicateRecipe')}
                removeMessage={msg('process.menu.removeRecipe.message', {recipe: recipe.name})}
                removeTooltip={msg('process.menu.removeRecipe.tooltip')}
                onClick={onSelect ? () => onSelect(recipe.id) : null}
                onDuplicate={onDuplicate ? () => onDuplicate(recipe.id) : null}
                onRemove={onRemove ? () => onRemove(recipe.id) : null}
            />
        )
    }

    getRecipeTypeName(type) {
        const recipeType = getRecipeType(type)
        return recipeType && recipeType.labels.name
    }

}

RecipeListData.propTypes = {
    onDuplicate: PropTypes.func,
    onRemove: PropTypes.func,
    onSelect: PropTypes.func
}
