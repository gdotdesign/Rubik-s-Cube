require 'guard'

guard 'shell' do
  watch('^/Source') {|m| `./build` }
end
