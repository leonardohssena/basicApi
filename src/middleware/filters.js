import { string } from '../support/filters'

const props = {
	name: string('name')
}

const removeUnfoundKey = (props) => ([ key ]) => Object.keys(props).includes(key)
const removeEmpty = ([ _, value ]) => !!value

const transform = (props) => ([ key, value ]) => props[key](value)

const reducer = (acc, { key, value }) => ({ ...acc, [key]: value })

export default (req, _, next) => {
	const { query } = req

	const filterRemoveUnfoundKey = removeUnfoundKey(props)
	const mapTransform = transform(props)

	const filters = Object
		.entries(query)
		.filter(filterRemoveUnfoundKey)
		.filter(removeEmpty)
		.map(mapTransform)
		.reduce(reducer, {})

	req.filters = filters

	next()
}
